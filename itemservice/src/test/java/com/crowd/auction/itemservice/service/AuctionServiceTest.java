package com.crowd.auction.itemservice.service;

import com.crowd.auction.itemservice.domain.Auction;
import com.crowd.auction.itemservice.domain.AuctionStatus;
import com.crowd.auction.itemservice.dto.AuctionRequestDTO;
import com.crowd.auction.itemservice.dto.AuctionResponseDTO;
import com.crowd.auction.itemservice.mapper.AuctionMapper;
import com.crowd.auction.itemservice.messaging.KafkaProducer;
import com.crowd.auction.itemservice.repository.AuctionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuctionServiceTest {

    @Mock
    private AuctionRepository auctionRepository;

    @Mock
    private AuctionMapper auctionMapper;

    @Mock
    private KafkaProducer kafkaProducer;

    @InjectMocks
    private AuctionService auctionService;

    private Auction auction;
    private AuctionRequestDTO requestDTO;
    private AuctionResponseDTO responseDTO;

    @BeforeEach
    void setUp() {
        auction = Auction.builder()
                .id(1L)
                .userId("user1")
                .name("Test Auction")
                .status(AuctionStatus.DRAFT)
                .build();

        requestDTO = AuctionRequestDTO.builder()
                .name("Test Auction")
                .build();

        responseDTO = AuctionResponseDTO.builder()
                .id(1L)
                .name("Test Auction")
                .status(AuctionStatus.DRAFT)
                .build();
    }

    @Test
    void getAuctionById_Success() {
        when(auctionRepository.findById(1L)).thenReturn(Optional.of(auction));
        when(auctionMapper.toResponseDTO(auction)).thenReturn(responseDTO);

        AuctionResponseDTO result = auctionService.getAuctionById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(auctionRepository, times(1)).findById(1L);
    }

    @Test
    void createAuction_Success() {
        when(auctionMapper.toEntity(requestDTO)).thenReturn(auction);
        when(auctionRepository.save(auction)).thenReturn(auction);
        when(auctionMapper.toResponseDTO(auction)).thenReturn(responseDTO);

        AuctionResponseDTO result = auctionService.createAuction(requestDTO);

        assertNotNull(result);
        assertEquals(AuctionStatus.DRAFT, result.getStatus());
        verify(kafkaProducer, times(1)).sendAuctionEvent(eq("AUCTION_CREATED"), any());
    }
}
