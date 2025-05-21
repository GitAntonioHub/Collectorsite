package com.Collectorsite.Backend.controller;

import com.Collectorsite.Backend.dto.ItemDTO;
import com.Collectorsite.Backend.service.ItemService;
import com.Collectorsite.Backend.enums.ItemStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
} 