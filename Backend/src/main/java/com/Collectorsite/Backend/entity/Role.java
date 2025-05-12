package com.Collectorsite.Backend.entity;

import lombok.*;
import jakarta.persistence.*;
import java.util.*;
import com.Collectorsite.Backend.enums.RoleName;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity
public class Role {

    @Id @GeneratedValue
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(unique = true, nullable = false)
    private RoleName name;

    @ManyToMany(mappedBy = "roles")
    private Set<AppUser> users = new HashSet<>();
}
