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

@RestController
@RequestMapping("/listings")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class PublicListingController {

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
     * Get a specific listing by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ListingDTO> getListing(@PathVariable java.util.UUID id) {
        return ResponseEntity.ok(service.get(id));
    }
} 