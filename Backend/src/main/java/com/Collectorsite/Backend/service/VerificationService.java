package com.Collectorsite.Backend.service;

import com.Collectorsite.Backend.dto.VerificationDTO;
import com.Collectorsite.Backend.dto.VerificationDecisionDTO;
import java.util.List;

public interface VerificationService {
    List<VerificationDTO> listPending();
    VerificationDTO decide(VerificationDecisionDTO dto, java.util.UUID verifierId);
}
