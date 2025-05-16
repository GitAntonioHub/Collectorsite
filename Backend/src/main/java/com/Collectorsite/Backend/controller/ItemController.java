package com.Collectorsite.Backend.controller;

import com.Collectorsite.Backend.dto.ItemDTO;
import com.Collectorsite.Backend.service.ItemService;
import com.Collectorsite.Backend.enums.ItemStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController 
@RequestMapping("/items") 
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ItemController {

    private final ItemService service;

    @PostMapping
    public ResponseEntity<ItemDTO> create(@Valid @RequestBody ItemDTO dto, Principal principal) {
        try {
            UUID ownerId = UUID.fromString(principal.getName());
            return ResponseEntity.ok(service.create(dto, ownerId));
        } catch (Exception e) {
            throw new RuntimeException("Failed to create item: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemDTO> get(@PathVariable UUID id) {
        try {
            return ResponseEntity.ok(service.get(id));
        } catch (Exception e) {
            throw new RuntimeException("Failed to get item: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<ItemDTO>> list() {
        try {
            return ResponseEntity.ok(service.list());
        } catch (Exception e) {
            throw new RuntimeException("Failed to list items: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/make-listable")
    public ResponseEntity<ItemDTO> makeListable(@PathVariable UUID id, Principal principal) {
        try {
            UUID ownerId = UUID.fromString(principal.getName());
            ItemDTO item = service.get(id);
            
            if (!item.getStatus().equals(ItemStatus.DRAFT)) {
                throw new RuntimeException("Item must be in DRAFT status to make it listable");
            }
            
            // Update the item status to AVAILABLE
            item.setStatus(ItemStatus.AVAILABLE);
            return ResponseEntity.ok(service.update(item, ownerId));
        } catch (Exception e) {
            throw new RuntimeException("Failed to make item listable: " + e.getMessage());
        }
    }
}
