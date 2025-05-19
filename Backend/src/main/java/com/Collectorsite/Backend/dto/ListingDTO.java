package com.Collectorsite.Backend.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import com.Collectorsite.Backend.enums.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ListingDTO {
    private UUID id;
    private UUID itemId;
    private ListingType listingType;
    private BigDecimal price;
    private String currency;
    private Instant startDate;
    private Instant endDate;
    private ListingStatus status;
    private OwnerDTO owner;
    
    // Item details
    private String title;
    private String description;
    private String imageUrl;
    private ItemCondition condition;
    private Integer year;
    private Double estimatedValue;
}
