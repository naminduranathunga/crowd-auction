package com.crowd.auction.bidservice.repository;

import com.crowd.auction.bidservice.domain.Bid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {
    List<Bid> findTop20ByItemIdOrderByCreatedAtDesc(Long itemId);
}
