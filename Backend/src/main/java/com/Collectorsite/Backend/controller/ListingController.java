package com.Collectorsite.Backend.controller;

import com.Collectorsite.Backend.dto.*;
import com.Collectorsite.Backend.enums.ListingStatus;
import com.Collectorsite.Backend.service.ListingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ListingController {

    private final ListingService service;

    /**
     * Public feed endpoint - returns paginated listings that are not SOLD or TRADED
     * Supports sorting by createdAt and price
     */
    @GetMapping("/listings")
    public ResponseEntity<Page<ListingDTO>> getListings(
            @RequestParam(defaultValue = "") String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {
        
        String[] sortParts = sort.split(",");
        Sort.Direction direction = sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc") 
            ? Sort.Direction.ASC 
            : Sort.Direction.DESC;
        
        return ResponseEntity.ok(service.getActiveListings(
            q, 
            PageRequest.of(page, size, Sort.by(direction, sortParts[0]))
        ));
    }

    /**
     * Feed endpoint with status filtering
     */
    @GetMapping("/listings/feed")
    public ResponseEntity<Page<ListingDTO>> getFeed(
            @RequestParam(defaultValue = "ACTIVE") String status,
            @RequestParam(defaultValue = "") String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {
        
        ListingStatus listingStatus;
        try {
            listingStatus = ListingStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            listingStatus = ListingStatus.ACTIVE; // Default to ACTIVE if invalid status
        }

        String[] sortParts = sort.split(",");
        Sort.Direction direction = sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc") 
            ? Sort.Direction.ASC 
            : Sort.Direction.DESC;
        
        return ResponseEntity.ok(service.feed(
            listingStatus,
            q, 
            PageRequest.of(page, size, Sort.by(direction, sortParts[0]))
        ));
    }

    /**
     * Get a specific listing by ID
     */
    @GetMapping("/listings/{id}")
    public ResponseEntity<ListingDTO> getListing(@PathVariable UUID id) {
        return ResponseEntity.ok(service.get(id));
    }

    /**
     * Create a new listing (requires authentication)
     */
    @PostMapping("/listings")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ListingDTO> createListing(
            @RequestBody CreateListingDTO dto,
            Principal principal) {
        UUID sellerId = UUID.fromString(principal.getName());
        return ResponseEntity.ok(service.create(dto, sellerId));
    }

    /**
     * Close a listing (owner only)
     */
    @PutMapping("/listings/{id}/close")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ListingDTO> closeListing(
            @PathVariable UUID id,
            Principal principal) {
        UUID sellerId = UUID.fromString(principal.getName());
        return ResponseEntity.ok(service.close(id, sellerId));
    }

    /**
     * Update a listing (owner only)
     */
    @PutMapping("/listings/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ListingDTO> updateListing(
            @PathVariable UUID id,
            @RequestBody UpdateListingDTO dto,
            Principal principal) {
        UUID sellerId = UUID.fromString(principal.getName());
        return ResponseEntity.ok(service.update(id, dto, sellerId));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<String> handleTypeMismatch(MethodArgumentTypeMismatchException e) {
        if (e.getRequiredType() == UUID.class) {
            return ResponseEntity.badRequest().body("Invalid UUID format");
        }
        return ResponseEntity.badRequest().body("Invalid parameter type");
    }
}
