package com.crowd.auction.bidservice.service;

import com.crowd.auction.bidservice.domain.Bid;
import com.crowd.auction.bidservice.dto.*;
import com.crowd.auction.bidservice.exception.InvalidBidException;
import com.crowd.auction.bidservice.exception.ResourceNotFoundException;
import com.crowd.auction.bidservice.messaging.KafkaProducer;
import com.crowd.auction.bidservice.messaging.BidWebSocketPublisher;
import com.crowd.auction.bidservice.repository.BidRepository;
import com.crowd.auction.itemservice.dto.BidEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BidService {

    private final BidRepository bidRepository;
    private final StringRedisTemplate redisTemplate;
    private final RestTemplate restTemplate;
    private final KafkaProducer kafkaProducer;
    private final BidWebSocketPublisher bidWebSocketPublisher;

    private static final String ITEM_SERVICE_URL = "http://itemservice/api/v1/internal/items/";

    private static final String LUA_SCRIPT =
            "local status = redis.call('hget', KEYS[1], 'status')\n" +
            "if not status then\n" +
            "    return -1\n" +
            "end\n" +
            "local startTime = tonumber(redis.call('hget', KEYS[1], 'startTime'))\n" +
            "local endTime = tonumber(redis.call('hget', KEYS[1], 'endTime'))\n" +
            "local currentTime = tonumber(ARGV[2])\n" +
            "if status ~= 'ACTIVE' or currentTime < startTime or currentTime > endTime then\n" +
            "    return -2\n" +
            "end\n" +
            "local currentPrice = tonumber(redis.call('hget', KEYS[1], 'currentPrice'))\n" +
            "local newBid = tonumber(ARGV[1])\n" +
            "if newBid <= currentPrice then\n" +
            "    return -3\n" +
            "end\n" +
            "redis.call('hset', KEYS[1], 'currentPrice', ARGV[1])\n" +
            "return 1";

    @Transactional
    public BidResponseDTO placeBid(Long itemId, BidRequestDTO request) {
        long currentTime = Instant.now().toEpochMilli();
        BigDecimal amount = request.getAmount();

        Long result = executeLuaScript(itemId, amount, currentTime);

        if (result == -1) {
            log.info("Item state not found in cache for item ID {}. Fetching from Item Service...", itemId);
            ItemStateResponseDTO state = fetchItemState(itemId);
            if (state == null) {
                throw new ResourceNotFoundException("Item not found");
            }
            cacheItemState(state);
            // Retry Lua Script
            result = executeLuaScript(itemId, amount, currentTime);
        }

        if (result == -2) {
            throw new InvalidBidException("Auction is not open for bidding");
        } else if (result == -3) {
            throw new InvalidBidException("Bid amount must be higher than the current highest bid");
        } else if (result == 1) {
            // Save bid to PostgreSQL
            Bid bid = Bid.builder()
                    .itemId(itemId)
                    .userId(request.getUserId())
                    .amount(amount)
                    .createdAt(LocalDateTime.now())
                    .build();
            Bid savedBid = bidRepository.save(bid);

            // Publish BidEvent to Kafka topic
            BidEvent event = BidEvent.builder()
                    .eventType("BID_PLACED")
                    .itemId(itemId)
                    .price(amount)
                    .build();
            kafkaProducer.sendBidEvent(event);

            try {
                bidWebSocketPublisher.publishBidUpdate(convertToResponse(savedBid));
            } catch (Exception e) {
                log.warn("Failed to publish websocket update for bid {}", savedBid.getId(), e);
            }

            return convertToResponse(savedBid);
        } else {
            throw new RuntimeException("Failed to place bid due to an unexpected cache state");
        }
    }

    public List<BidResponseDTO> getBidsByItemId(Long itemId) {
        return bidRepository.findTop20ByItemIdOrderByCreatedAtDesc(itemId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    private Long executeLuaScript(Long itemId, BigDecimal amount, long currentTime) {
        DefaultRedisScript<Long> script = new DefaultRedisScript<>();
        script.setScriptText(LUA_SCRIPT);
        script.setResultType(Long.class);

        return redisTemplate.execute(
                script,
                Collections.singletonList("item:state:" + itemId),
                amount.toString(),
                String.valueOf(currentTime)
        );
    }

    private ItemStateResponseDTO fetchItemState(Long itemId) {
        try {
            return restTemplate.getForObject(ITEM_SERVICE_URL + itemId, ItemStateResponseDTO.class);
        } catch (Exception e) {
            log.error("Failed to fetch state for item ID {} from Item Service", itemId, e);
            return null;
        }
    }

    private void cacheItemState(ItemStateResponseDTO state) {
        String key = "item:state:" + state.getItemId();
        Map<String, String> map = new HashMap<>();
        map.put("status", state.getStatus());
        map.put("startTime", String.valueOf(state.getStartTime().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()));
        map.put("endTime", String.valueOf(state.getEndTime().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()));
        map.put("currentPrice", state.getCurrentPrice().toString());

        redisTemplate.opsForHash().putAll(key, map);
        
        long diff = state.getEndTime().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli() - Instant.now().toEpochMilli();
        long expireSec = Math.max(3600, (diff / 1000) + 3600);
        redisTemplate.expire(key, Duration.ofSeconds(expireSec));
    }

    private BidResponseDTO convertToResponse(Bid bid) {
        return BidResponseDTO.builder()
                .id(bid.getId())
                .itemId(bid.getItemId())
                .userId(bid.getUserId())
                .amount(bid.getAmount())
                .createdAt(bid.getCreatedAt())
                .build();
    }
}
