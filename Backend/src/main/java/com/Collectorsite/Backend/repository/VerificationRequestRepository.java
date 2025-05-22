package com.Collectorsite.Backend.repository;

import com.Collectorsite.Backend.entity.VerificationRequest;
import com.Collectorsite.Backend.enums.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VerificationRequestRepository extends JpaRepository<VerificationRequest, UUID> {

    List<VerificationRequest> findByStatus(VerificationStatus status);

    Optional<VerificationRequest> findTopByItem_IdOrderByRequestedAtDesc(UUID itemId);

    boolean existsByItem_IdAndStatus(UUID itemId, VerificationStatus status);
    
    // Updated to use VerificationStatus enum
    List<VerificationRequest> findByItemIdAndStatus(UUID itemId, VerificationStatus status);
}
