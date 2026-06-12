package com.crowd.auction.itemservice.dto;

import com.crowd.auction.itemservice.domain.AuctionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuctionResponseDTO {
    private Long id;
    private String userId;
    private String name;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private AuctionStatus status;
    private List<ItemResponseDTO> items;
}
