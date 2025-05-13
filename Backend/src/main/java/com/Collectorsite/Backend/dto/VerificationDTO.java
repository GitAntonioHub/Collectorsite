package com.Collectorsite.Backend.dto;

import lombok.*;
import java.time.Instant;
import java.util.UUID;
import com.Collectorsite.Backend.enums.VerificationStatus;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VerificationDTO {
    private UUID id;
    private UUID itemId;
    private VerificationStatus status;
    private String notes;
    private Instant requestedAt;
    private Instant verifiedAt;
}
