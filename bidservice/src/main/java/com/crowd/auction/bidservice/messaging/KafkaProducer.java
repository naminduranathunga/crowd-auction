package com.crowd.auction.bidservice.messaging;

import com.crowd.auction.itemservice.dto.BidEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class KafkaProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final String BID_TOPIC = "bid-events";

    public void sendBidEvent(BidEvent event) {
        kafkaTemplate.send(BID_TOPIC, event.getItemId().toString(), event);
        log.info("Sent bid event: {} to topic: {}", event, BID_TOPIC);
    }
}
