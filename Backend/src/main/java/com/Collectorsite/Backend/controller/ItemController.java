package com.Collectorsite.Backend.controller;

import com.Collectorsite.Backend.dto.ItemDTO;
import com.Collectorsite.Backend.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController @RequestMapping("/items") @RequiredArgsConstructor
public class ItemController {

    private final ItemService service;

    @PostMapping
    public ResponseEntity<ItemDTO> create(@RequestBody ItemDTO dto, Principal principal) {
        UUID ownerId = UUID.fromString(principal.getName());
        return ResponseEntity.ok(service.create(dto, ownerId));
    }

    @GetMapping("/{id}")
    public ItemDTO get(@PathVariable UUID id) {
        return service.get(id);
    }

    @GetMapping
    public List<ItemDTO> list() {
        return service.list();
    }
}
