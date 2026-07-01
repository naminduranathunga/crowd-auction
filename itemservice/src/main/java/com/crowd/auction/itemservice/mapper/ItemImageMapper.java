package com.crowd.auction.itemservice.mapper;

import com.crowd.auction.itemservice.domain.ItemImage;
import com.crowd.auction.itemservice.dto.ItemImageResponseDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ItemImageMapper {
    ItemImageResponseDTO toResponseDTO(ItemImage itemImage);
}