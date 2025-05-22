package com.Collectorsite.Backend.entity;

import lombok.*;
import jakarta.persistence.*;
import java.time.Instant;
import java.util.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@Entity @Table(name = "app_user")
public class AppUser {

    @Id @GeneratedValue
    @Column(name = "id")
    private UUID id;

    @Column(name = "username", nullable = false, length = 50, unique = true)
    private String username;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "display_name")
    private String displayName;
    
    @Column(name = "avatar_url")
    private String avatarUrl;
    
    @Column(name = "rating")
    private Double rating;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;
    @PrePersist
    private void onCreate() {
        if (createdAt == null) {
            createdAt = java.time.Instant.now();
        }
    }
    
    @Column(name = "last_login")
    private Instant lastLogin;

    @Builder.Default
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();
}
