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
@RequestMapping("/api/listings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ListingController {

    private final ListingService service;

    /**
     * Public browse endpoint - returns paginated active listings
     */
    @GetMapping
    public ResponseEntity<Page<ListingDTO>> browse(
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
     * Public feed endpoint - filtered by status (defaults to ACTIVE)
     */
    @GetMapping("/feed")
    public ResponseEntity<Page<ListingDTO>> feed(
            @RequestParam(defaultValue = "ACTIVE") ListingStatus status,
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort) {
        
        String[] sortParts = sort.split(",");
        Sort.Direction direction = sortParts.length > 1 && sortParts[1].equalsIgnoreCase("asc") 
            ? Sort.Direction.ASC 
            : Sort.Direction.DESC;
        
        return ResponseEntity.ok(service.feed(
            status,
            keyword, 
            PageRequest.of(page, size, Sort.by(direction, sortParts[0]))
        ));
    }

    /**
     * Get user's listings (requires authentication)
     */
    @GetMapping("/my-listings")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<ListingDTO>> getMyListings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            Principal principal) {
        UUID sellerId = UUID.fromString(principal.getName());
        return ResponseEntity.ok(service.getListingsBySeller(
            sellerId,
            PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"))
        ));
    }

    /**
     * Get a specific listing by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ListingDTO> getListing(@PathVariable UUID id) {
        return ResponseEntity.ok(service.get(id));
    }

    /**
     * Create a new listing (requires authentication)
     */
    @PostMapping
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
    @PutMapping("/{id}/close")
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
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ListingDTO> updateListing(
            @PathVariable UUID id,
            @RequestBody UpdateListingDTO dto,
            Principal principal) {
        UUID sellerId = UUID.fromString(principal.getName());
        return ResponseEntity.ok(service.update(id, dto, sellerId));
    }

    /**
     * Delete a listing (owner only)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteListing(
            @PathVariable UUID id,
            Principal principal) {
        UUID sellerId = UUID.fromString(principal.getName());
        service.delete(id, sellerId);
        return ResponseEntity.ok().build();
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<String> handleTypeMismatch(MethodArgumentTypeMismatchException e) {
        if (e.getRequiredType() == UUID.class) {
            return ResponseEntity.badRequest().body("Invalid UUID format");
        }
        return ResponseEntity.badRequest().body("Invalid parameter type");
    }
}
