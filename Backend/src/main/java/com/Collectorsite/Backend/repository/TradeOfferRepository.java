package com.Collectorsite.Backend.repository;

import com.Collectorsite.Backend.entity.TradeOffer;
import com.Collectorsite.Backend.enums.TradeStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TradeOfferRepository extends JpaRepository<TradeOffer, UUID> {
    List<TradeOffer> findByRequestedItem_Id(UUID itemId);
    List<TradeOffer> findByProposer_Id(UUID userId);
    long countByStatus(TradeStatus status);
}
