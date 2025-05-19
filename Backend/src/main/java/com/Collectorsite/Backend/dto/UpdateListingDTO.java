package com.Collectorsite.Backend.dto;

import lombok.*;
import java.math.BigDecimal;
import com.Collectorsite.Backend.enums.ListingType;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UpdateListingDTO {
    private String title;
    private String description;
    private BigDecimal price;
    private String currency;
    private ListingType listingType;
} 