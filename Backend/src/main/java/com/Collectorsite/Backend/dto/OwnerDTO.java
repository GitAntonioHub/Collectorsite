package com.Collectorsite.Backend.dto;

import lombok.*;
import java.util.UUID;
 
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OwnerDTO {
    private UUID id;
    private String displayName;
} 