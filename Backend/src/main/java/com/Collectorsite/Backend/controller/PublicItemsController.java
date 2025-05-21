package com.Collectorsite.Backend.controller;

import com.Collectorsite.Backend.dto.ItemDTO;
import com.Collectorsite.Backend.service.ItemService;
import com.Collectorsite.Backend.enums.ItemStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/items")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class PublicItemsController {

    private final ItemService service;

    @GetMapping("/{id}")
    public ResponseEntity<ItemDTO> get(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(service.get(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<ItemDTO>> list() {
        // Get all items and filter to only return AVAILABLE and LISTED items
        List<ItemDTO> allItems = service.list();
        List<ItemDTO> availableItems = allItems.stream()
            .filter(item -> item.getStatus() == ItemStatus.AVAILABLE || item.getStatus() == ItemStatus.LISTED)
            .collect(Collectors.toList());
        return ResponseEntity.ok(availableItems);
    }
    
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ItemDTO> create(@Valid @RequestBody ItemDTO dto, Principal principal) {
        try {
            UUID ownerId = UUID.fromString(principal.getName());
            return ResponseEntity.ok(service.create(dto, ownerId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Add a redirect for /items/my-items to point users to the correct endpoint
    @GetMapping("/my-items")
    public ResponseEntity<Void> redirectMyItems() {
        return ResponseEntity.status(301)
            .header("Location", "/my-items")
            .build();
    }
} 