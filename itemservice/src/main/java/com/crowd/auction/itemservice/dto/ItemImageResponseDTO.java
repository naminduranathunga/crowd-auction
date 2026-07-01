package com.crowd.auction.itemservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ItemImageResponseDTO {
    private Long id;
    private String objectKey;
    private String imageUrl;
    private String originalFilename;
    private String contentType;
    private Integer sortOrder;
    private boolean primaryImage;
}