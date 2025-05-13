package com.Collectorsite.Backend.dto;

import com.Collectorsite.Backend.enums.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TransactionDTO {
    private UUID id;
    private UUID listingId;
    private UUID tradeOfferId;
    private UUID buyerId;
    private UUID sellerId;
    private BigDecimal totalPrice;          // BigDecimal to match entity
    private PaymentStatus paymentStatus;
    private Instant shippedAt;
    private Instant deliveredAt;
    private Instant completedAt;
}
