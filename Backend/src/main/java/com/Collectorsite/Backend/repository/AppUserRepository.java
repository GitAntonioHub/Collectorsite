package com.Collectorsite.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Collectorsite.Backend.entity.AppUser;
import java.util.Optional;
import java.util.UUID;

public interface AppUserRepository extends JpaRepository<AppUser, UUID> {
    Optional<AppUser> findByUsername(String username);
    Optional<AppUser> findByEmail(String email);
    boolean existsByEmail(String email);
}