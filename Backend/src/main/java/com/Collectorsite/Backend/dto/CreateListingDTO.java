package com.Collectorsite.Backend.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.UUID;
import com.Collectorsite.Backend.enums.ListingType;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CreateListingDTO {
    private UUID itemId;
    private ListingType listingType;   // SALE or AUCTION
    private BigDecimal price;
    private String currency;           // e.g. "USD"
    private Long durationDays;         // optional – auto‑compute endDate
}
