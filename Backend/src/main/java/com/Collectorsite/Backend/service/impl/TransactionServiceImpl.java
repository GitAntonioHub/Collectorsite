package com.Collectorsite.Backend.service.impl;

import com.Collectorsite.Backend.dto.TransactionDTO;
import com.Collectorsite.Backend.entity.*;
import com.Collectorsite.Backend.enums.ItemStatus;
import com.Collectorsite.Backend.enums.ListingStatus;
import com.Collectorsite.Backend.enums.TradeStatus;
import com.Collectorsite.Backend.repository.*;
import com.Collectorsite.Backend.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.*;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

/**
 * Minimal transaction logic:
 *  • closes listing & marks item SOLD
 *  • swaps item ownership for accepted trades
 */
@Service
@RequiredArgsConstructor
@Transactional
public class TransactionServiceImpl implements TransactionService {

    private final ListingRepository       listingRepo;
    private final TradeOfferRepository    offerRepo;
    private final TransactionRepository   txRepo;

    /* ---------------- mapper ---------------- */
    private TransactionDTO toDto(Transaction t) {
        return TransactionDTO.builder()
                .id(t.getId())
                .listingId(t.getListing()     != null ? t.getListing().getId()     : null)
                .tradeOfferId(t.getTradeOffer()!= null ? t.getTradeOffer().getId() : null)
                .buyerId(t.getBuyer().getId())
                .sellerId(t.getSeller().getId())
                .totalPrice(t.getTotalPrice())
                .paymentStatus(t.getPaymentStatus())
                .shippedAt(t.getShippedAt())
                .deliveredAt(t.getDeliveredAt())
                .completedAt(t.getCompletedAt())
                .build();
    }

    /* ---------------- direct purchase ---------------- */
    @Override
    public TransactionDTO createFromListing(UUID listingId, UUID buyerId) {

        Listing listing = listingRepo.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));

        if (listing.getStatus() != ListingStatus.ACTIVE)
            throw new RuntimeException("Listing not active");

        Transaction tx = Transaction.builder()
                .listing(listing)
                .buyer(AppUser.builder().id(buyerId).build())
                .seller(listing.getSeller())
                .totalPrice(listing.getPrice())
                .completedAt(Instant.now())
                .build();

        listing.setStatus(ListingStatus.CLOSED);
        listing.getItem().setStatus(ItemStatus.SOLD);

        txRepo.save(tx);
        return toDto(tx);
    }

    /* ---------------- trade offer accepted ---------------- */
    @Override
    public TransactionDTO createFromTradeOffer(UUID offerId, UUID ownerId) {

        TradeOffer offer = offerRepo.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offer not found"));

        if (!offer.getRequestedItem().getOwner().getId().equals(ownerId))
            throw new RuntimeException("You cannot accept this offer");

        if (offer.getStatus() != TradeStatus.PENDING)
            throw new RuntimeException("Offer already resolved");

        offer.setStatus(TradeStatus.ACCEPTED);

        /* -- swap ownership -- */
        AppUser requester = offer.getProposer();
        AppUser owner     = offer.getRequestedItem().getOwner();

        CollectorItem requested = offer.getRequestedItem();
        requested.setOwner(requester);
        requested.setStatus(ItemStatus.TRADED);

        if (offer.getOfferedItem() != null) {
            CollectorItem offered = offer.getOfferedItem();
            offered.setOwner(owner);
            offered.setStatus(ItemStatus.TRADED);
        }

        BigDecimal cash = offer.getCashAdjustment() == null
                ? BigDecimal.ZERO
                : BigDecimal.valueOf(offer.getCashAdjustment());

        Transaction tx = Transaction.builder()
                .tradeOffer(offer)
                .buyer(requester)
                .seller(owner)
                .totalPrice(cash)
                .completedAt(Instant.now())
                .build();

        txRepo.save(tx);
        return toDto(tx);
    }
}
