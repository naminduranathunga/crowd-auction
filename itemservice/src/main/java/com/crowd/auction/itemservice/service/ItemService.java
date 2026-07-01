package com.crowd.auction.itemservice.service;

import com.crowd.auction.itemservice.domain.Auction;
import com.crowd.auction.itemservice.domain.Item;
import com.crowd.auction.itemservice.domain.ItemImage;
import com.crowd.auction.itemservice.dto.ItemRequestDTO;
import com.crowd.auction.itemservice.dto.ItemResponseDTO;
import com.crowd.auction.itemservice.dto.ItemStateResponseDTO;
import com.crowd.auction.itemservice.exception.ResourceNotFoundException;
import com.crowd.auction.itemservice.mapper.ItemMapper;
import com.crowd.auction.itemservice.messaging.KafkaProducer;
import com.crowd.auction.itemservice.repository.AuctionRepository;
import com.crowd.auction.itemservice.repository.ItemRepository;
import com.crowd.auction.itemservice.service.storage.ObjectStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ItemService {

    private final ItemRepository itemRepository;
    private final AuctionRepository auctionRepository;
    private final ItemMapper itemMapper;
    private final KafkaProducer kafkaProducer;
    private final ObjectStorageService objectStorageService;

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
        return createItem(auctionId, requestDTO, Collections.emptyList());
    }

    @Transactional
    public ItemResponseDTO createItem(Long auctionId, ItemRequestDTO requestDTO, List<MultipartFile> images) {
        Auction auction = auctionRepository.findById(auctionId)
                .orElseThrow(() -> new ResourceNotFoundException("Auction not found"));
        
        Item item = itemMapper.toEntity(requestDTO);
        item.setAuction(auction);
        item.setCurrentPrice(item.getStartPrice()); // Initially current price is start price
        
        Item savedItem = itemRepository.save(item);
        attachImages(savedItem, images);
        Item persistedItem = itemRepository.save(savedItem);
        ItemResponseDTO responseDTO = itemMapper.toResponseDTO(persistedItem);
        
        kafkaProducer.sendItemEvent("ITEM_CREATED", responseDTO);
        return responseDTO;
    }

    @Transactional
    public ItemResponseDTO updateItem(Long auctionId, Long itemId, ItemRequestDTO requestDTO) {
        return updateItem(auctionId, itemId, requestDTO, Collections.emptyList());
    }

    @Transactional
    public ItemResponseDTO updateItem(Long auctionId, Long itemId, ItemRequestDTO requestDTO, List<MultipartFile> images) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not found"));
        
        if (!item.getAuction().getId().equals(auctionId)) {
            throw new RuntimeException("Item does not belong to this auction");
        }
        
        itemMapper.updateEntityFromDTO(requestDTO, item);
        attachImages(item, images);
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
        
        List<String> objectKeys = item.getImages().stream()
                .map(ItemImage::getObjectKey)
                .toList();
        ItemResponseDTO responseDTO = itemMapper.toResponseDTO(item);
        itemRepository.delete(item);
        objectKeys.forEach(objectStorageService::delete);
        
        kafkaProducer.sendItemEvent("ITEM_DELETED", responseDTO);
    }

    private void attachImages(Item item, List<MultipartFile> images) {
        if (images == null || images.isEmpty()) {
            return;
        }

        int nextSortOrder = item.getImages().size();
        for (MultipartFile image : images) {
            if (image == null || image.isEmpty()) {
                continue;
            }

            String objectKey = buildObjectKey(item, image, nextSortOrder);
            String imageUrl = objectStorageService.upload(objectKey, image);
            boolean primaryImage = item.getImages().isEmpty() && nextSortOrder == 0;

            item.getImages().add(ItemImage.builder()
                    .item(item)
                    .objectKey(objectKey)
                    .imageUrl(imageUrl)
                    .originalFilename(image.getOriginalFilename())
                    .contentType(image.getContentType())
                    .sortOrder(nextSortOrder)
                    .primaryImage(primaryImage)
                    .build());
            nextSortOrder++;
        }
    }

    private String buildObjectKey(Item item, MultipartFile image, int sortOrder) {
        String originalFilename = image.getOriginalFilename() == null ? "image" : image.getOriginalFilename();
        String extension = "";
        int extensionIndex = originalFilename.lastIndexOf('.');
        if (extensionIndex >= 0) {
            extension = originalFilename.substring(extensionIndex);
        }

        return "auctions/%s/items/%s/%s-%s%s".formatted(
                item.getAuction().getId(),
                item.getId(),
                sortOrder,
                UUID.randomUUID(),
                extension
        );
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
