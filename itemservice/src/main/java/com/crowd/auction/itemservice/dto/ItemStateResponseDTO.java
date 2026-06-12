package com.crowd.auction.itemservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemStateResponseDTO {
    private Long itemId;
    private Long auctionId;
    private BigDecimal startPrice;
    private BigDecimal currentPrice;
    private String status;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
