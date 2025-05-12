package com.Collectorsite.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Collectorsite.Backend.entity.VerificationRequest;
import java.util.UUID;

public interface VerificationRequestRepository extends JpaRepository<VerificationRequest, UUID> {
}
