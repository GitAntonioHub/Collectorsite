package com.Collectorsite.Backend.service;

import com.Collectorsite.Backend.dto.TransactionDTO;

import java.util.UUID;

public interface TransactionService {
    TransactionDTO createFromListing(UUID listingId, UUID buyerId);
    TransactionDTO createFromTradeOffer(UUID offerId, UUID ownerId);   // owner accepts
}
