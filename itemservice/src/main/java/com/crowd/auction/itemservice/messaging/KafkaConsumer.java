package com.crowd.auction.itemservice.messaging;

import com.crowd.auction.itemservice.domain.Item;
import com.crowd.auction.itemservice.dto.BidEvent;
import com.crowd.auction.itemservice.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class KafkaConsumer {

    private final ItemRepository itemRepository;

    @KafkaListener(topics = "bid-events", groupId = "item-service-group")
    public void consumeBidEvent(BidEvent event) {
        log.info("Received bid event: {}", event);
        
        Optional<Item> itemOpt = itemRepository.findById(event.getItemId());
        if (itemOpt.isPresent()) {
            Item item = itemOpt.get();
            item.setCurrentPrice(event.getPrice());
            itemRepository.save(item);
            log.info("Updated item {} current price to {}", item.getId(), event.getPrice());
        } else {
            log.warn("Item not found for id: {}", event.getItemId());
        }
    }
}
