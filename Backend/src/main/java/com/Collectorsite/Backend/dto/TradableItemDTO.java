package com.Collectorsite.Backend.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class TradableItemDTO {
    private UUID id;
    private String title;
    private String description;
    private BigDecimal estimatedValue;
    private List<String> images;
} 