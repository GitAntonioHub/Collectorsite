package com.Collectorsite.Backend.entity;

import lombok.*;
import jakarta.persistence.*;
import java.util.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
public class Category {

    @Id @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String name;

    @ManyToOne @JoinColumn(name = "parent_id")
    private Category parent;

    @OneToMany(mappedBy = "parent")
    private List<Category> children = new ArrayList<>();
}
