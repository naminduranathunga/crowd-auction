package com.crowd.auction.itemservice.controller;

import com.crowd.auction.itemservice.dto.ItemStateResponseDTO;
import com.crowd.auction.itemservice.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/internal/items")
@RequiredArgsConstructor
public class ItemInternalController {

    private final ItemService itemService;

    @GetMapping("/{itemId}")
    public ResponseEntity<ItemStateResponseDTO> getItemState(@PathVariable Long itemId) {
        return ResponseEntity.ok(itemService.getItemState(itemId));
    }
}
