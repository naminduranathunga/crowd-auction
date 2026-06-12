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
public class ItemRequestDTO {
    private String name;
    private String description;
    private BigDecimal startPrice;
    private BigDecimal currentPrice;
}
