package com.crowd.auction.itemservice.service;

import com.crowd.auction.itemservice.domain.Auction;
import com.crowd.auction.itemservice.domain.Item;
import com.crowd.auction.itemservice.dto.ItemRequestDTO;
import com.crowd.auction.itemservice.dto.ItemResponseDTO;
import com.crowd.auction.itemservice.dto.ItemStateResponseDTO;
import com.crowd.auction.itemservice.exception.ResourceNotFoundException;
import com.crowd.auction.itemservice.mapper.ItemMapper;
import com.crowd.auction.itemservice.messaging.KafkaProducer;
import com.crowd.auction.itemservice.repository.AuctionRepository;
import com.crowd.auction.itemservice.repository.ItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;
    private final AuctionRepository auctionRepository;
    private final ItemMapper itemMapper;
    private final KafkaProducer kafkaProducer;

    public List<ItemResponseDTO> getItemsByAuctionId(Long auctionId) {
        return itemRepository.findByAuctionId(auctionId).stream()
                .map(itemMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public ItemResponseDTO getItemById(Long auctionId, Long itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        
        if (!item.getAuction().getId().equals(auctionId)) {
            throw new RuntimeException("Item does not belong to this auction");
        }
        
        return itemMapper.toResponseDTO(item);
    }

    @Transactional
    public ItemResponseDTO createItem(Long auctionId, ItemRequestDTO requestDTO) {
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException("Auction not found"));
        
        Item item = itemMapper.toEntity(requestDTO);
        item.setAuction(auction);
        item.setCurrentPrice(item.getStartPrice()); // Initially current price is start price
        
        Item savedItem = itemRepository.save(item);
        ItemResponseDTO responseDTO = itemMapper.toResponseDTO(savedItem);
        
        kafkaProducer.sendItemEvent("ITEM_CREATED", responseDTO);
        return responseDTO;
    }

    @Transactional
    public ItemResponseDTO updateItem(Long auctionId, Long itemId, ItemRequestDTO requestDTO) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        
        if (!item.getAuction().getId().equals(auctionId)) {
            throw new RuntimeException("Item does not belong to this auction");
        }
        
        itemMapper.updateEntityFromDTO(requestDTO, item);
        Item savedItem = itemRepository.save(item);
        ItemResponseDTO responseDTO = itemMapper.toResponseDTO(savedItem);
        
        kafkaProducer.sendItemEvent("ITEM_UPDATED", responseDTO);
        return responseDTO;
    }

    @Transactional
    public void deleteItem(Long auctionId, Long itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        
        if (!item.getAuction().getId().equals(auctionId)) {
            throw new RuntimeException("Item does not belong to this auction");
        }
        
        ItemResponseDTO responseDTO = itemMapper.toResponseDTO(item);
        itemRepository.delete(item);
        
        kafkaProducer.sendItemEvent("ITEM_DELETED", responseDTO);
    }

    public ItemStateResponseDTO getItemState(Long itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        Auction auction = item.getAuction();
        return ItemStateResponseDTO.builder()
                .itemId(item.getId())
                .auctionId(auction.getId())
                .startPrice(item.getStartPrice())
                .currentPrice(item.getCurrentPrice())
                .status(auction.getStatus().name())
                .startTime(auction.getStartTime())
                .endTime(auction.getEndTime())
                .build();
    }
}
