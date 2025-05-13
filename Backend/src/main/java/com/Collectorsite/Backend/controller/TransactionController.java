package com.Collectorsite.Backend.controller;

import com.Collectorsite.Backend.dto.TransactionDTO;
import com.Collectorsite.Backend.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.UUID;

@RestController
@RequestMapping("/tx")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService service;

    @PostMapping("/buy/{listingId}")
    public ResponseEntity<TransactionDTO> buy(@PathVariable UUID listingId,
                                              Principal principal) {
        UUID buyerId = UUID.fromString(principal.getName());
        return ResponseEntity.ok(service.createFromListing(listingId, buyerId));
    }

    @PostMapping("/trade/accept/{offerId}")
    public TransactionDTO acceptTrade(@PathVariable UUID offerId, Principal principal) {
        UUID ownerId = UUID.fromString(principal.getName());
        return service.createFromTradeOffer(offerId, ownerId);
    }
}
