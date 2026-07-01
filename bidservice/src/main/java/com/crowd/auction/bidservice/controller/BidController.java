package com.crowd.auction.bidservice.controller;

import com.crowd.auction.bidservice.dto.BidRequestDTO;
import com.crowd.auction.bidservice.dto.BidResponseDTO;
import com.crowd.auction.bidservice.service.BidService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/items")
@RequiredArgsConstructor
@Tag(name = "Bid Management", description = "Endpoints for placing and reading bids on auction items")
public class BidController {

    private final BidService bidService;

    @PostMapping("/{id}/bids")
    @Operation(summary = "Place a new bid on an item")
    public ResponseEntity<BidResponseDTO> placeBid(@PathVariable("id") Long itemId, @RequestBody BidRequestDTO request) {
        return ResponseEntity.ok(bidService.placeBid(itemId, request));
    }

    @GetMapping("/{id}/bids")
    @Operation(summary = "Get the last 20 bids for an item")
    public ResponseEntity<List<BidResponseDTO>> getBidsByItemId(@PathVariable("id") Long itemId) {
        return ResponseEntity.ok(bidService.getBidsByItemId(itemId));
    }
}
