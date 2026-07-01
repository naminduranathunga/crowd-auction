package com.crowd.auction.itemservice.controller;

import com.crowd.auction.itemservice.dto.ItemRequestDTO;
import com.crowd.auction.itemservice.dto.ItemResponseDTO;
import com.crowd.auction.itemservice.service.ItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auctions/{auctionId}/items")
@RequiredArgsConstructor
@Tag(name = "Item Management", description = "Endpoints for managing items within an auction")
public class ItemController {

    private final ItemService itemService;

    @GetMapping
    @Operation(summary = "Get all items in an auction")
    public ResponseEntity<List<ItemResponseDTO>> getItemsByAuctionId(@PathVariable Long auctionId) {
        return ResponseEntity.ok(itemService.getItemsByAuctionId(auctionId));
    }

    @GetMapping("/{itemId}")
    @Operation(summary = "Get a single item in an auction")
    public ResponseEntity<ItemResponseDTO> getItemById(@PathVariable Long auctionId, @PathVariable Long itemId) {
        return ResponseEntity.ok(itemService.getItemById(auctionId, itemId));
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Create an item for an auction")
    public ResponseEntity<ItemResponseDTO> createItem(@PathVariable Long auctionId, @RequestBody ItemRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(itemService.createItem(auctionId, requestDTO));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Create an item for an auction with images")
    public ResponseEntity<ItemResponseDTO> createItemWithImages(
            @PathVariable Long auctionId,
            @RequestPart("item") ItemRequestDTO requestDTO,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        return ResponseEntity.status(HttpStatus.CREATED).body(itemService.createItem(auctionId, requestDTO, images));
    }

    @PatchMapping(value = "/{itemId}", consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Update item details for an auction")
    public ResponseEntity<ItemResponseDTO> updateItem(@PathVariable Long auctionId, @PathVariable Long itemId, @RequestBody ItemRequestDTO requestDTO) {
        return ResponseEntity.ok(itemService.updateItem(auctionId, itemId, requestDTO));
    }

    @PatchMapping(value = "/{itemId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Update item details for an auction with images")
    public ResponseEntity<ItemResponseDTO> updateItemWithImages(
            @PathVariable Long auctionId,
            @PathVariable Long itemId,
            @RequestPart("item") ItemRequestDTO requestDTO,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        return ResponseEntity.ok(itemService.updateItem(auctionId, itemId, requestDTO, images));
    }

    @DeleteMapping("/{itemId}")
    @Operation(summary = "Delete an item for an auction")
    public ResponseEntity<Void> deleteItem(@PathVariable Long auctionId, @PathVariable Long itemId) {
        itemService.deleteItem(auctionId, itemId);
        return ResponseEntity.noContent().build();
    }
}
