package com.Collectorsite.Backend.entity;

import lombok.*;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;
import com.Collectorsite.Backend.enums.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
public class Listing {

    @Id @GeneratedValue
    private UUID id;

    @OneToOne @JoinColumn(nullable = false, unique = true)
    private CollectorItem item;

    @ManyToOne @JoinColumn(nullable = false)
    private AppUser seller;

    @Enumerated(EnumType.STRING)
    private ListingType listingType = ListingType.SALE;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(nullable = false, length = 3)
    private String currency = "USD";

    @Column(nullable = false, updatable = false)
    private Instant startDate;

    private Instant endDate;
    
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    private void onCreate() {
        if (startDate == null) {
            startDate = Instant.now();
        }
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private ListingStatus status = ListingStatus.ACTIVE;
}
