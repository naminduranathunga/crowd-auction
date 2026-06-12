package com.crowd.auction.itemservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BidEvent {
    private String eventType;
    private Long itemId;
    private BigDecimal price;
}
