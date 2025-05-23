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

    @ManyToOne @JoinColumn(name = "item_id", nullable = false)
    private CollectorItem item;

    @ManyToOne @JoinColumn(name = "requested_by_id", nullable = false)

    private AppUser requestedBy;

    @Column(name = "requested_by", nullable = false, updatable = false)
    private UUID requestedByUUID;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private VerificationStatus status = VerificationStatus.PENDING;

    @ManyToOne @JoinColumn(name = "verified_by_id")
    private AppUser verifiedBy;

    @Column(name = "verified_by_id", nullable = true, insertable = false, updatable = false)
    private UUID verifiedByUUID;

    @Column(name = "requested_at", nullable = false, updatable = false)
    private Instant requestedAt = Instant.now();

    @Column(name = "verified_at")
    private Instant verifiedAt;

    @Lob
    @Column(name = "notes", columnDefinition = "text")
    private String notes;
    
    @PrePersist
    private void onPersist() {
        if (requestedBy != null && requestedByUUID == null) {
            requestedByUUID = requestedBy.getId();
        }
        if (verifiedBy != null && verifiedByUUID == null) {
            verifiedByUUID = verifiedBy.getId();
        }
    }
}
