package com.Collectorsite.Backend.controller;

import com.Collectorsite.Backend.entity.TradeOffer;
import com.Collectorsite.Backend.enums.TradeStatus;
import com.Collectorsite.Backend.service.TradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.UUID;

@RestController
@RequestMapping("/trade")
@RequiredArgsConstructor
public class TradeController {

    private final TradeService service;

    record ProposeDTO(UUID requestedItemId, UUID offeredItemId, Double cash) { }

    @PostMapping("/propose")
    public ResponseEntity<TradeOffer> propose(@RequestBody ProposeDTO dto,
                                              Principal principal) {
        UUID proposerId = UUID.fromString(principal.getName());
        TradeOffer offer = service.propose(proposerId, dto.requestedItemId(),
                dto.offeredItemId(), dto.cash());
        return ResponseEntity.ok(offer);
    }

    @PutMapping("/{offerId}/{decision}")
    public TradeOffer decide(@PathVariable UUID offerId,
                             @PathVariable TradeStatus decision,
                             Principal principal) {
        UUID ownerId = UUID.fromString(principal.getName());
        return service.respond(offerId, decision, ownerId);
    }
}
