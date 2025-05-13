package com.Collectorsite.Backend.controller;

import com.Collectorsite.Backend.dto.*;
import com.Collectorsite.Backend.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/verification")
@RequiredArgsConstructor
@PreAuthorize("hasRole('VERIFIER')")
public class VerificationController {

    private final VerificationService service;

    @GetMapping("/pending")
    public List<VerificationDTO> pending() {
        return service.listPending();
    }

    @PostMapping("/decide")
    public VerificationDTO decide(@RequestBody VerificationDecisionDTO dto, Principal principal) {
        UUID verifierId = UUID.fromString(principal.getName());
        return service.decide(dto, verifierId);
    }
}
