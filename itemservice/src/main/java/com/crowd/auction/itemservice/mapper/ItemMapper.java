package com.crowd.auction.itemservice.mapper;

import com.crowd.auction.itemservice.domain.Item;
import com.crowd.auction.itemservice.domain.ItemImage;
import com.crowd.auction.itemservice.dto.ItemRequestDTO;
import com.crowd.auction.itemservice.dto.ItemResponseDTO;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.Comparator;
import java.util.List;

@Mapper(componentModel = "spring", uses = {ItemImageMapper.class}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface ItemMapper {

    @Mapping(target = "auctionId", source = "auction.id")
    ItemResponseDTO toResponseDTO(Item item);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "auction", ignore = true)
    Item toEntity(ItemRequestDTO requestDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "auction", ignore = true)
    void updateEntityFromDTO(ItemRequestDTO requestDTO, @MappingTarget Item item);

    @AfterMapping
    default void populateCoverImage(Item item, @MappingTarget ItemResponseDTO responseDTO) {
        List<ItemImage> images = item.getImages();
        if (images == null || images.isEmpty()) {
            responseDTO.setCoverImageUrl(null);
            return;
        }

        ItemImage coverImage = images.stream()
                .filter(ItemImage::isPrimaryImage)
                .findFirst()
                .orElseGet(() -> images.stream()
                        .min(Comparator.comparing(ItemImage::getSortOrder))
                        .orElse(null));

        responseDTO.setCoverImageUrl(coverImage != null ? coverImage.getImageUrl() : null);
    }
}
