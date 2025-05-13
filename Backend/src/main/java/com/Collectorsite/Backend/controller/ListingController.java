package com.Collectorsite.Backend.controller;

import com.Collectorsite.Backend.dto.*;
import com.Collectorsite.Backend.service.ListingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/listings")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService service;

    @PostMapping
    public ResponseEntity<ListingDTO> create(@RequestBody CreateListingDTO dto,
                                             Principal principal) {
        UUID sellerId = UUID.fromString(principal.getName());
        return ResponseEntity.ok(service.create(dto, sellerId));
    }

    @PutMapping("/{id}/close")
    public ListingDTO close(@PathVariable UUID id, Principal principal) {
        UUID sellerId = UUID.fromString(principal.getName());
        return service.close(id, sellerId);
    }

    @GetMapping
    public List<ListingDTO> listActive() {
        return service.listActive();
    }

    @GetMapping("/{id}")
    public ListingDTO get(@PathVariable UUID id) {
        return service.get(id);
    }
}
