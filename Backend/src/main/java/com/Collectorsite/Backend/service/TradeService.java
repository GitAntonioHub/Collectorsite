package com.Collectorsite.Backend.service;

import com.Collectorsite.Backend.entity.TradeOffer;
import com.Collectorsite.Backend.enums.TradeStatus;

import java.util.UUID;

public interface TradeService {
    TradeOffer propose(UUID proposerId, UUID requestedItemId, UUID offeredItemId, Double cash);
    TradeOffer respond(UUID offerId, TradeStatus decision, UUID ownerId);
}
