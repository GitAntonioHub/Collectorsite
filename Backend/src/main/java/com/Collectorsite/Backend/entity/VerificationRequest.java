package com.Collectorsite.Backend.entity;

import lombok.*;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;
import com.Collectorsite.Backend.enums.VerificationStatus;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Table(name = "verification_request")
public class VerificationRequest {

    @Id 
    @GeneratedValue
    @Column(name = "id")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_id", nullable = false)
    private CollectorItem item;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requested_by_id", nullable = false)
    private AppUser requestedBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private VerificationStatus status = VerificationStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "verified_by_id")
    private AppUser verifiedBy;

    @Column(name = "requested_at", nullable = false, updatable = false)
    private Instant requestedAt = Instant.now();

    @Column(name = "verified_at")
    private Instant verifiedAt;

    @Lob
    @Column(name = "notes", columnDefinition = "text")
    private String notes;
}
