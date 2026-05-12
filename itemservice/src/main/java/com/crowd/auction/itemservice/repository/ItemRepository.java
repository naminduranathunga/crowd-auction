package com.crowd.auction.itemservice.repository;

import com.crowd.auction.itemservice.domain.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    List<Item> findByAuctionId(Long auctionId);
}
