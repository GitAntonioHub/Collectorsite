package com.Collectorsite.Backend.dto;

import com.Collectorsite.Backend.enums.TradeStatus; // This enum will need to be created
import lombok.Builder;
import lombok.Data;

import java.time.Instant; // Using Instant for timestamps
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class TradeOfferDTO {
    private UUID id;
    private UUID requestedItemId;
    // Based on frontend model, this is a single item. 
    // The CreateTradeOfferRequestDTO in controller had List<UUID> offeredItemIds and a single offeredItemId.
    // For the DTO representing an existing offer, sticking to one offered item ID for now.
    private UUID offeredItemId; 
    private TradeStatus status;
    private Instant offerDate;
    private Instant lastUpdated;
    private String offerMessage;

    // Nested item details can be represented by TradableItemDTO or simplified here
    private TradableItemDTO offeredItemDetails; 
    private TradableItemDTO requestedItemDetails;
} 