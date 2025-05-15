package com.Collectorsite.Backend.entity;

import lombok.*;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
import com.Collectorsite.Backend.enums.VerificationStatus;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
public class VerificationRequest {

    @Id @GeneratedValue
    private UUID id;

    @ManyToOne @JoinColumn(nullable = false)
    private CollectorItem item;

    @ManyToOne @JoinColumn(nullable = false)
    private AppUser requestedBy;

    @Enumerated(EnumType.STRING)
    private VerificationStatus status = VerificationStatus.PENDING;

    @ManyToOne
    private AppUser verifiedBy;

    @Column(nullable = false, updatable = false)
    private Instant requestedAt = Instant.now();

    private Instant verifiedAt;

    @Lob
    @Column(columnDefinition = "text")
    private String notes;
}
