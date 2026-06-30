package com.crowd.auction.itemservice.mapper;

import com.crowd.auction.itemservice.domain.Auction;
import com.crowd.auction.itemservice.dto.AuctionRequestDTO;
import com.crowd.auction.itemservice.dto.AuctionResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring", uses = {ItemMapper.class}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface AuctionMapper {

    AuctionResponseDTO toResponseDTO(Auction auction);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "items", ignore = true)
    Auction toEntity(AuctionRequestDTO requestDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "items", ignore = true)
    void updateEntityFromDTO(AuctionRequestDTO requestDTO, @MappingTarget Auction auction);
}
