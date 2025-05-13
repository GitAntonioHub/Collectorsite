package com.Collectorsite.Backend.dto;

import lombok.*;
import com.Collectorsite.Backend.enums.VerificationStatus;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VerificationDecisionDTO {
    private UUID verificationId;
    private VerificationStatus decision;
    private String notes;
}
