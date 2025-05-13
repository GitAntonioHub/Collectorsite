package com.Collectorsite.Backend.entity;

import com.Collectorsite.Backend.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
public class Transaction {

    @Id @GeneratedValue
    private UUID id;

    @OneToOne
    private Listing listing;            // null for trade

    @OneToOne
    private TradeOffer tradeOffer;      // null for direct sale

    @ManyToOne @JoinColumn(nullable = false)
    private AppUser buyer;

    @ManyToOne @JoinColumn(nullable = false)
    private AppUser seller;

    private BigDecimal totalPrice;      // <-- BigDecimal now

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus = PaymentStatus.PENDING;

    private Instant shippedAt;
    private Instant deliveredAt;
    private Instant completedAt;
}
