package com.Collectorsite.Backend.controller;

import com.Collectorsite.Backend.dto.TradableItemDTO;
import com.Collectorsite.Backend.dto.TradeOfferDTO;
import com.Collectorsite.Backend.entity.TradeOffer;
import com.Collectorsite.Backend.enums.TradeStatus;
import com.Collectorsite.Backend.service.TradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/trades")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class TradeController {

    private final TradeService service;

    @GetMapping("/available-items")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TradableItemDTO>> getAvailableItems() {
        return ResponseEntity.ok(List.of());
    }

    record CreateTradeOfferRequestDTO(UUID requestedItemId, UUID offeredItemId, List<UUID> offeredItemIds, Double cashAmount) { }

    @PostMapping("/offers")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TradeOfferDTO> createTradeOffer(@RequestBody CreateTradeOfferRequestDTO dto, Principal principal) {
        UUID proposerId = UUID.fromString(principal.getName());
        return ResponseEntity.status(501).build();
    }

    @GetMapping("/my-offers")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TradeOfferDTO>> getMyTradeOffers(Principal principal) {
        UUID userId = UUID.fromString(principal.getName());
        return ResponseEntity.ok(List.of());
    }
}
