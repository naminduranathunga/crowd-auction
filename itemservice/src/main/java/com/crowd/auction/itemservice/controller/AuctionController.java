package com.crowd.auction.itemservice.controller;

import com.crowd.auction.itemservice.dto.AuctionRequestDTO;
import com.crowd.auction.itemservice.dto.AuctionResponseDTO;
import com.crowd.auction.itemservice.service.AuctionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auctions")
@RequiredArgsConstructor
@Tag(name = "Auction Management", description = "Endpoints for managing auctions")
public class AuctionController {

    private final AuctionService auctionService;

    @GetMapping
    @Operation(summary = "Get all auctions")
    public ResponseEntity<List<AuctionResponseDTO>> getAllAuctions() {
        return ResponseEntity.ok(auctionService.getAllAuctions());
    }

    @GetMapping("/{auctionId}")
    @Operation(summary = "Get a single auction by ID")
    public ResponseEntity<AuctionResponseDTO> getAuctionById(@PathVariable Long auctionId) {
        return ResponseEntity.ok(auctionService.getAuctionById(auctionId));
    }

    @PostMapping
    @Operation(summary = "Create a new auction")
    public ResponseEntity<AuctionResponseDTO> createAuction(@RequestBody AuctionRequestDTO requestDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(auctionService.createAuction(requestDTO));
    }

    @PatchMapping("/{auctionId}")
    @Operation(summary = "Update auction details")
    public ResponseEntity<AuctionResponseDTO> updateAuction(@PathVariable Long auctionId, @RequestBody AuctionRequestDTO requestDTO) {
        return ResponseEntity.ok(auctionService.updateAuction(auctionId, requestDTO));
    }

    @DeleteMapping("/{auctionId}")
    @Operation(summary = "Delete an auction")
    public ResponseEntity<Void> deleteAuction(@PathVariable Long auctionId) {
        auctionService.deleteAuction(auctionId);
        return ResponseEntity.noContent().build();
    }
}
