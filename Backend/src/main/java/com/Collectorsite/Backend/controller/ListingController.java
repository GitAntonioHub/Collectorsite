package com.Collectorsite.Backend.controller;

import com.Collectorsite.Backend.dto.*;
import com.Collectorsite.Backend.enums.ListingStatus;
import com.Collectorsite.Backend.service.ListingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

    /* ---------- write endpoints ---------- */

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

    /* ---------- read endpoints ---------- */

    /** New paginated feed:
     *  /listings?q=spider&page=0&size=12&status=ACTIVE */
    @GetMapping
    public Page<ListingDTO> feed(@RequestParam(defaultValue = "ACTIVE") ListingStatus status,
                                 @RequestParam(defaultValue = "") String q,
                                 @RequestParam(defaultValue = "0") int page,
                                 @RequestParam(defaultValue = "12") int size) {
        return service.feed(status, q, PageRequest.of(page, size));
    }

    /** Legacy endpoint – still returns all ACTIVE listings un‑paged */
    @GetMapping("/active-all")
    public List<ListingDTO> listActive() {
        return service.listActive();
    }

    @GetMapping("/{id}")
    public ListingDTO get(@PathVariable UUID id) {
        return service.get(id);
    }
}
