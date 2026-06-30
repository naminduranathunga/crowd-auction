package com.crowd.auction.itemservice.mapper;

import com.crowd.auction.itemservice.domain.Item;
import com.crowd.auction.itemservice.dto.ItemRequestDTO;
import com.crowd.auction.itemservice.dto.ItemResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ItemMapper {

    @Mapping(target = "auctionId", source = "auction.id")
    ItemResponseDTO toResponseDTO(Item item);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "auction", ignore = true)
    Item toEntity(ItemRequestDTO requestDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "auction", ignore = true)
    void updateEntityFromDTO(ItemRequestDTO requestDTO, @MappingTarget Item item);
}
