package com.Collectorsite.Backend.entity;

import com.Collectorsite.Backend.enums.TradeStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
public class TradeOffer {

    @Id @GeneratedValue
    private UUID id;

    @ManyToOne @JoinColumn(name = "offering_user_id", nullable = false)
    private AppUser proposer;

    @ManyToOne @JoinColumn(nullable = false)
    private CollectorItem requestedItem;

    @ManyToOne
    private CollectorItem offeredItem;      // nullable = cash‑only offer

    private Double cashAdjustment;

    private Instant createdAt;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private TradeStatus status = TradeStatus.PENDING;
}
