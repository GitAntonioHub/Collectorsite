package com.Collectorsite.Backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
public class Notification {

    @Id @GeneratedValue
    private UUID id;

    @ManyToOne @JoinColumn(nullable = false)
    private AppUser user;

    private String type;

    @Lob
    @Column(columnDefinition = "text")
    private String payloadJson;

    @Builder.Default
    private Boolean read = false;

    @Builder.Default
    private Instant createdAt = Instant.now();
}
