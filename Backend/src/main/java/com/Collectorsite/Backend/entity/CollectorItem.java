package com.Collectorsite.Backend.entity;

import lombok.*;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.*;
import com.Collectorsite.Backend.enums.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
public class CollectorItem {

    @Id @GeneratedValue
    private UUID id;

    @ManyToOne @JoinColumn(nullable = false)
    private AppUser owner;

    @ManyToOne
    private Category category;

    @Column(nullable = false, length = 150)
    private String title;

    @Lob
    @Column(columnDefinition = "text")
    private String description;

    @Enumerated(EnumType.STRING)
    private ItemCondition condition;

    private Integer year;
    private Double estimatedValue;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private ItemStatus status = ItemStatus.DRAFT;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;
    @PrePersist
    private void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemDocument> documents = new ArrayList<>();
}
