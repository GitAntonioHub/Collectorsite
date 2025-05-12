package com.Collectorsite.Backend.entity;

import lombok.*;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
public class ItemDocument {

    @Id @GeneratedValue
    private UUID id;

    @ManyToOne @JoinColumn(nullable = false)
    private CollectorItem item;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private String filePath;

    @Column(nullable = false, updatable = false)
    private Instant uploadedAt = Instant.now();
}
