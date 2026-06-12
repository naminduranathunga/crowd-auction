package com.crowd.auction.bidservice.service;

import com.crowd.auction.bidservice.domain.Bid;
import com.crowd.auction.bidservice.dto.*;
import com.crowd.auction.bidservice.exception.InvalidBidException;
import com.crowd.auction.bidservice.exception.ResourceNotFoundException;
import com.crowd.auction.bidservice.messaging.KafkaProducer;
import com.crowd.auction.bidservice.repository.BidRepository;
import com.crowd.auction.itemservice.dto.BidEvent;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BidServiceTest {

    @Mock
    private BidRepository bidRepository;

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private KafkaProducer kafkaProducer;

    @Mock
    private HashOperations<String, Object, Object> hashOperations;

    @InjectMocks
    private BidService bidService;

    private BidRequestDTO bidRequest;

    @BeforeEach
    void setUp() {
        bidRequest = BidRequestDTO.builder()
                .userId("user1")
                .amount(new BigDecimal("150.00"))
                .build();
    }

    @Test
    void testPlaceBid_Success() {
        when(redisTemplate.execute(any(RedisScript.class), anyList(), anyString(), anyString()))
                .thenReturn(1L);

        Bid savedBid = Bid.builder()
                .id(1L)
                .itemId(100L)
                .userId("user1")
                .amount(new BigDecimal("150.00"))
                .createdAt(LocalDateTime.now())
                .build();

        when(bidRepository.save(any(Bid.class))).thenReturn(savedBid);

        BidResponseDTO response = bidService.placeBid(100L, bidRequest);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(100L, response.getItemId());
        assertEquals("user1", response.getUserId());
        assertEquals(new BigDecimal("150.00"), response.getAmount());

        verify(bidRepository, times(1)).save(any(Bid.class));
        verify(kafkaProducer, times(1)).sendBidEvent(any(BidEvent.class));
    }

    @Test
    void testPlaceBid_InvalidBidAmount() {
        when(redisTemplate.execute(any(RedisScript.class), anyList(), anyString(), anyString()))
                .thenReturn(-3L);

        assertThrows(InvalidBidException.class, () -> bidService.placeBid(100L, bidRequest));
        verify(bidRepository, never()).save(any(Bid.class));
    }

    @Test
    void testPlaceBid_AuctionNotOpen() {
        when(redisTemplate.execute(any(RedisScript.class), anyList(), anyString(), anyString()))
                .thenReturn(-2L);

        assertThrows(InvalidBidException.class, () -> bidService.placeBid(100L, bidRequest));
        verify(bidRepository, never()).save(any(Bid.class));
    }

    @Test
    void testPlaceBid_CacheMiss_ThenSuccess() {
        when(redisTemplate.execute(any(RedisScript.class), anyList(), anyString(), anyString()))
                .thenReturn(-1L)
                .thenReturn(1L);

        ItemStateResponseDTO state = ItemStateResponseDTO.builder()
                .itemId(100L)
                .auctionId(50L)
                .status("ACTIVE")
                .startTime(LocalDateTime.now().minusHours(1))
                .endTime(LocalDateTime.now().plusHours(1))
                .startPrice(new BigDecimal("100.00"))
                .currentPrice(new BigDecimal("100.00"))
                .build();

        when(restTemplate.getForObject(anyString(), eq(ItemStateResponseDTO.class))).thenReturn(state);
        when(redisTemplate.opsForHash()).thenReturn(hashOperations);

        Bid savedBid = Bid.builder()
                .id(1L)
                .itemId(100L)
                .userId("user1")
                .amount(new BigDecimal("150.00"))
                .createdAt(LocalDateTime.now())
                .build();

        when(bidRepository.save(any(Bid.class))).thenReturn(savedBid);

        BidResponseDTO response = bidService.placeBid(100L, bidRequest);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        verify(restTemplate, times(1)).getForObject(anyString(), eq(ItemStateResponseDTO.class));
        verify(redisTemplate, times(2)).execute(any(RedisScript.class), anyList(), anyString(), anyString());
    }

    @Test
    void testPlaceBid_CacheMiss_ItemNotFoundInService() {
        when(redisTemplate.execute(any(RedisScript.class), anyList(), anyString(), anyString()))
                .thenReturn(-1L);

        when(restTemplate.getForObject(anyString(), eq(ItemStateResponseDTO.class))).thenReturn(null);

        assertThrows(ResourceNotFoundException.class, () -> bidService.placeBid(100L, bidRequest));
        verify(redisTemplate, times(1)).execute(any(RedisScript.class), anyList(), anyString(), anyString());
    }

    @Test
    void testGetBidsByItemId() {
        Bid bid = Bid.builder()
                .id(1L)
                .itemId(100L)
                .userId("user1")
                .amount(new BigDecimal("150.00"))
                .createdAt(LocalDateTime.now())
                .build();

        when(bidRepository.findTop20ByItemIdOrderByCreatedAtDesc(100L)).thenReturn(Collections.singletonList(bid));

        List<BidResponseDTO> bids = bidService.getBidsByItemId(100L);

        assertFalse(bids.isEmpty());
        assertEquals(1, bids.size());
        assertEquals(new BigDecimal("150.00"), bids.get(0).getAmount());
    }
}
