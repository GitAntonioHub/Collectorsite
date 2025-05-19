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

    @PutMapping("/{id}")
    public ResponseEntity<ItemDTO> update(@PathVariable UUID id, @Valid @RequestBody ItemDTO dto, Principal principal) {
        try {
            UUID ownerId = UUID.fromString(principal.getName());
            return ResponseEntity.ok(service.update(dto, ownerId));
        } catch (Exception e) {
            throw new RuntimeException("Failed to update item: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id, Principal principal) {
        try {
            UUID ownerId = UUID.fromString(principal.getName());
            service.delete(id, ownerId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete item: " + e.getMessage());
        }
    }

    @PostMapping("/{id}/make-listable")
    public ResponseEntity<ItemDTO> makeListable(@PathVariable UUID id, Principal principal) {
        try {
            UUID ownerId = UUID.fromString(principal.getName());
            return ResponseEntity.ok(service.makeListable(id, ownerId));
        } catch (Exception e) {
            throw new RuntimeException("Failed to make item listable: " + e.getMessage());
        }
    }
}
