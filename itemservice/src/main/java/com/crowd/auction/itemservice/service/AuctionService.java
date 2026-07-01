package com.crowd.auction.itemservice.service;

import com.crowd.auction.itemservice.domain.Auction;
import com.crowd.auction.itemservice.domain.AuctionStatus;
import com.crowd.auction.itemservice.dto.AuctionRequestDTO;
import com.crowd.auction.itemservice.dto.AuctionResponseDTO;
import com.crowd.auction.itemservice.exception.ResourceNotFoundException;
import com.crowd.auction.itemservice.mapper.AuctionMapper;
import com.crowd.auction.itemservice.messaging.KafkaProducer;
import com.crowd.auction.itemservice.repository.AuctionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuctionService {

    private final AuctionRepository auctionRepository;
    private final AuctionMapper auctionMapper;
    private final KafkaProducer kafkaProducer;

    public List<AuctionResponseDTO> getAllAuctions() {
        return auctionRepository.findAll().stream()
                .map(auctionMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    public AuctionResponseDTO getAuctionById(Long id) {
        Auction auction = auctionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Auction not found"));
        return auctionMapper.toResponseDTO(auction);
    }

    @Transactional
    public AuctionResponseDTO createAuction(AuctionRequestDTO requestDTO) {
        Auction auction = auctionMapper.toEntity(requestDTO);
        auction.setStatus(AuctionStatus.ACTIVE); // Default status
        Auction savedAuction = auctionRepository.save(auction);
        
        AuctionResponseDTO responseDTO = auctionMapper.toResponseDTO(savedAuction);
        kafkaProducer.sendAuctionEvent("AUCTION_CREATED", responseDTO);
        return responseDTO;
    }

    @Transactional
    public AuctionResponseDTO updateAuction(Long id, AuctionRequestDTO requestDTO) {
        Auction auction = auctionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Auction not found"));
        
        AuctionStatus oldStatus = auction.getStatus();
        auctionMapper.updateEntityFromDTO(requestDTO, auction);
        
        if (requestDTO.getStatus() != null) {
            auction.setStatus(requestDTO.getStatus());
        }
        
        Auction savedAuction = auctionRepository.save(auction);
        AuctionResponseDTO responseDTO = auctionMapper.toResponseDTO(savedAuction);
        
        kafkaProducer.sendAuctionEvent("AUCTION_UPDATED", responseDTO);
        
        if (oldStatus != AuctionStatus.ACTIVE && savedAuction.getStatus() == AuctionStatus.ACTIVE) {
            kafkaProducer.sendAuctionEvent("AUCTION_OPEN", responseDTO);
        } else if (oldStatus != AuctionStatus.CLOSED && savedAuction.getStatus() == AuctionStatus.CLOSED) {
            kafkaProducer.sendAuctionEvent("AUCTION_CLOSE", responseDTO);
        }
        
        return responseDTO;
    }

    @Transactional
    public void deleteAuction(Long id) {
        Auction auction = auctionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Auction not found"));
        
        if (auction.getStatus() != AuctionStatus.DRAFT && auction.getStatus() != AuctionStatus.PENDING) {
            throw new IllegalStateException("Only draft or pending auctions can be deleted");
        }

        AuctionResponseDTO responseDTO = auctionMapper.toResponseDTO(auction);
        auctionRepository.delete(auction);
        
        kafkaProducer.sendAuctionEvent("AUCTION_DELETED", responseDTO);
    }
}
