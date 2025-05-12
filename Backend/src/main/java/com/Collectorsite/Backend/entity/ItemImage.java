package com.Collectorsite.Backend.entity;

import lombok.*;
import jakarta.persistence.*;
import java.util.UUID;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
public class ItemImage {

    @Id @GeneratedValue
    private UUID id;

    @ManyToOne @JoinColumn(nullable = false)
    private CollectorItem item;

    @Column(nullable = false)
    private String url;

    private Boolean isPrimary = false;
}
