package com.crowd.auction.bidservice.messaging;

import com.crowd.auction.bidservice.dto.BidResponseDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class BidWebSocketPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public void publishBidUpdate(BidResponseDTO bid) {
        messagingTemplate.convertAndSend("/topic/bids/" + bid.getItemId(), bid);
        log.info("Published websocket bid update for item {}", bid.getItemId());
    }
}