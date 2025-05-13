package com.Collectorsite.Backend.service.impl;

import com.Collectorsite.Backend.service.VerificationService;
import com.Collectorsite.Backend.dto.*;
import com.Collectorsite.Backend.entity.*;
import com.Collectorsite.Backend.enums.*;
import com.Collectorsite.Backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.*;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
@Transactional
public class VerificationServiceImpl implements VerificationService {

    private final VerificationRequestRepository verRepo;
    private final AppUserRepository userRepo;

    private VerificationDTO map(VerificationRequest v) {
        return VerificationDTO.builder()
                .id(v.getId())
                .itemId(v.getItem().getId())
                .status(v.getStatus())
                .notes(v.getNotes())
                .requestedAt(v.getRequestedAt())
                .verifiedAt(v.getVerifiedAt())
                .build();
    }

    @Override
    public List<VerificationDTO> listPending() {
        return verRepo.findByStatus(VerificationStatus.PENDING)
                .stream().map(this::map).collect(Collectors.toList());
    }

    @Override
    public VerificationDTO decide(VerificationDecisionDTO dto, UUID verifierId) {
        VerificationRequest vr = verRepo.findById(dto.getVerificationId())
                .orElseThrow(() -> new RuntimeException("Verification not found"));

        if (vr.getStatus() != VerificationStatus.PENDING)
            throw new RuntimeException("Already decided");

        AppUser verifier = userRepo.findById(verifierId).orElseThrow();

        vr.setStatus(dto.getDecision());
        vr.setNotes(dto.getNotes());
        vr.setVerifiedBy(verifier);
        vr.setVerifiedAt(Instant.now());

        if (dto.getDecision() == VerificationStatus.APPROVED) {
            vr.getItem().setStatus(ItemStatus.AVAILABLE);
        }


        return map(vr);
    }
}

