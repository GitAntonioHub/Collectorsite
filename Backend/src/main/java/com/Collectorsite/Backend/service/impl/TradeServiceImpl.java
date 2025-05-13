package com.Collectorsite.Backend.service.impl;

import com.Collectorsite.Backend.repository.*;
import com.Collectorsite.Backend.entity.*;
import com.Collectorsite.Backend.enums.TradeStatus;
import com.Collectorsite.Backend.service.TradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.*;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class TradeServiceImpl implements TradeService {

    private final TradeOfferRepository tradeRepo;
    private final CollectorItemRepository itemRepo;
    private final AppUserRepository userRepo;

    @Override
    public TradeOffer propose(UUID proposerId, UUID requestedItemId,
                              UUID offeredItemId, Double cash) {

        CollectorItem target = itemRepo.findById(requestedItemId)
                .orElseThrow(() -> new RuntimeException("Requested item not found"));
        CollectorItem offered = null;
        if (offeredItemId != null) {
            offered = itemRepo.findById(offeredItemId)
                    .orElseThrow(() -> new RuntimeException("Offered item not found"));
        }

        AppUser proposer = userRepo.findById(proposerId).orElseThrow();

        TradeOffer offer = TradeOffer.builder()
                .proposer(proposer)
                .requestedItem(target)
                .offeredItem(offered)
                .cashAdjustment(cash)
                .createdAt(Instant.now())
                .build();

        return tradeRepo.save(offer);
    }

    @Override
    public TradeOffer respond(UUID offerId, TradeStatus decision, UUID ownerId) {
        TradeOffer offer = tradeRepo.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offer not found"));

        if (!offer.getRequestedItem().getOwner().getId().equals(ownerId))
            throw new RuntimeException("Not the owner of the requested item");

        if (offer.getStatus() != TradeStatus.PENDING)
            throw new RuntimeException("Offer already decided");

        offer.setStatus(decision);
        return offer;
    }
}
