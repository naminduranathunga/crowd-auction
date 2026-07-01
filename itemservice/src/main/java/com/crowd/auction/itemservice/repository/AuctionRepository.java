package com.crowd.auction.itemservice.repository;

import com.crowd.auction.itemservice.domain.Auction;
import com.crowd.auction.itemservice.domain.AuctionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuctionRepository extends JpaRepository<Auction, Long> {
    List<Auction> findByStatusAndStartTimeLessThanEqual(AuctionStatus status, LocalDateTime time);
    List<Auction> findByStatusAndEndTimeLessThanEqual(AuctionStatus status, LocalDateTime time);
}
