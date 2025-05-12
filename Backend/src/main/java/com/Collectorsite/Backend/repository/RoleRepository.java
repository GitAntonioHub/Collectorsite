package com.Collectorsite.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Collectorsite.Backend.entity.Role;
import com.Collectorsite.Backend.enums.RoleName;
import java.util.Optional;
import java.util.UUID;

public interface RoleRepository extends JpaRepository<Role, UUID> {
    Optional<Role> findByName(RoleName name);
}
