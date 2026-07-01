package com.crowd.auction.itemservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemResponseDTO {
    private Long id;
    private Long auctionId;
    private String name;
    private String description;
    private BigDecimal startPrice;
    private BigDecimal currentPrice;
    private String coverImageUrl;

    @Builder.Default
    private List<ItemImageResponseDTO> images = new ArrayList<>();
}
