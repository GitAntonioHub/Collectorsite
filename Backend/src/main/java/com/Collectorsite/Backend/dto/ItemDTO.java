package com.Collectorsite.Backend.dto;

import lombok.*;
import java.util.UUID;
import com.Collectorsite.Backend.enums.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ItemDTO {
    private UUID id;
    private String title;
    private String description;
    private ItemCondition condition;
    private Integer year;
    private Double estimatedValue;
    private ItemStatus status;
}
