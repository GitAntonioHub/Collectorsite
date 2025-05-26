package com.Collectorsite.Backend.entity;

import lombok.*;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.*;
import com.Collectorsite.Backend.enums.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
@Table(name = "collectoritem")
public class CollectorItem {

    @Id @GeneratedValue
    @Column(name = "id")
    private UUID id;

    @ManyToOne @JoinColumn(name = "owner_id", nullable = false)
    private AppUser owner;

    @ManyToOne @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @Column(name = "createdat", nullable = false, updatable = false)
    private Instant createdAt;
    
    @PrePersist
    private void onCreate() {
        Instant now = Instant.now();
        if (createdAt == null) {
            createdAt = now;
        }
    }

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemImage> images = new ArrayList<>();

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemDocument> documents = new ArrayList<>();

    @Lob
    @Column(name = "description", columnDefinition = "text")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "condition")
    private ItemCondition condition;

    @Column(name = "year")
    private Integer year;
    
    @Column(name = "estimated_value")
    private Double estimatedValue;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ItemStatus status = ItemStatus.DRAFT;
}
