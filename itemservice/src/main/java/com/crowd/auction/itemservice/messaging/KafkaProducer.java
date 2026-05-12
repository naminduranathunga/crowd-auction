package com.crowd.auction.itemservice.messaging;

import com.crowd.auction.itemservice.dto.AuctionResponseDTO;
import com.crowd.auction.itemservice.dto.EventMessage;
import com.crowd.auction.itemservice.dto.ItemResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class KafkaProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final String AUCTION_TOPIC = "auction-events";
    private static final String ITEM_TOPIC = "item-events";

    public void sendAuctionEvent(String eventType, AuctionResponseDTO auction) {
        EventMessage<AuctionResponseDTO> message = new EventMessage<>(eventType, auction);
        kafkaTemplate.send(AUCTION_TOPIC, auction.getId().toString(), message);
        log.info("Sent auction event: {} for auction id: {}", eventType, auction.getId());
    }

    public void sendItemEvent(String eventType, ItemResponseDTO item) {
        EventMessage<ItemResponseDTO> message = new EventMessage<>(eventType, item);
        kafkaTemplate.send(ITEM_TOPIC, item.getId().toString(), message);
        log.info("Sent item event: {} for item id: {}", eventType, item.getId());
    }
}
