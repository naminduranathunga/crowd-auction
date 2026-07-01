package com.crowd.auction.itemservice.service;

import com.crowd.auction.itemservice.domain.Auction;
import com.crowd.auction.itemservice.domain.AuctionStatus;
import com.crowd.auction.itemservice.dto.AuctionRequestDTO;
import com.crowd.auction.itemservice.repository.AuctionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuctionScheduler {

    private final AuctionRepository auctionRepository;
    private final AuctionService auctionService;

    // Run every 10 seconds
    @Scheduled(fixedRate = 10000)
    @Transactional
    public void processAuctionStatusTransitions() {
        LocalDateTime now = LocalDateTime.now();

        // Find PENDING auctions where startTime <= now and transition to ACTIVE
        List<Auction> pendingAuctions = auctionRepository.findByStatusAndStartTimeLessThanEqual(AuctionStatus.PENDING, now);
        for (Auction auction : pendingAuctions) {
            log.info("Transitioning auction {} from PENDING to ACTIVE", auction.getId());
            AuctionRequestDTO requestDTO = new AuctionRequestDTO();
            requestDTO.setStatus(AuctionStatus.ACTIVE);
            requestDTO.setName(auction.getName());
            requestDTO.setDescription(auction.getDescription());
            requestDTO.setStartTime(auction.getStartTime());
            requestDTO.setEndTime(auction.getEndTime());
            auctionService.updateAuction(auction.getId(), requestDTO);
        }

        // Find ACTIVE auctions where endTime <= now and transition to CLOSED
        List<Auction> activeAuctions = auctionRepository.findByStatusAndEndTimeLessThanEqual(AuctionStatus.ACTIVE, now);
        for (Auction auction : activeAuctions) {
            log.info("Transitioning auction {} from ACTIVE to CLOSED", auction.getId());
            AuctionRequestDTO requestDTO = new AuctionRequestDTO();
            requestDTO.setStatus(AuctionStatus.CLOSED);
            requestDTO.setName(auction.getName());
            requestDTO.setDescription(auction.getDescription());
            requestDTO.setStartTime(auction.getStartTime());
            requestDTO.setEndTime(auction.getEndTime());
            auctionService.updateAuction(auction.getId(), requestDTO);
        }
    }
}
