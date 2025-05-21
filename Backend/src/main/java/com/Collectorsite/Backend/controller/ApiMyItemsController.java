package com.Collectorsite.Backend.controller;

import com.Collectorsite.Backend.dto.ItemDTO;
import com.Collectorsite.Backend.service.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController 
@RequestMapping("/api/my-items") 
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class ApiMyItemsController {

    private final ItemService service;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ItemDTO>> getMyItems(Principal principal) {
        try {
            UUID ownerId = UUID.fromString(principal.getName());
            return ResponseEntity.ok(service.getItemsByOwner(ownerId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ItemDTO> create(@Valid @RequestBody ItemDTO dto, Principal principal) {
        try {
            // Validate year is reasonable
            if (dto.getYear() != null && (dto.getYear() < 1800 || dto.getYear() > 2100)) {
                throw new IllegalArgumentException("Year must be between 1800 and 2100");
            }
            
            UUID ownerId = UUID.fromString(principal.getName());
            return ResponseEntity.ok(service.create(dto, ownerId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ItemDTO> get(@PathVariable UUID id, Principal principal) {
        try {
            UUID ownerId = UUID.fromString(principal.getName());
            ItemDTO item = service.get(id);
            
            // Check if the item belongs to the current user
            if (!item.getOwnerId().equals(ownerId)) {
                return ResponseEntity.status(403).build(); // Forbidden
            }
            
            return ResponseEntity.ok(item);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ItemDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody ItemDTO dto,
            Principal principal) {
        try {
            UUID ownerId = UUID.fromString(principal.getName());
            return ResponseEntity.ok(service.update(id, dto, ownerId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> delete(@PathVariable UUID id, Principal principal) {
        try {
            UUID ownerId = UUID.fromString(principal.getName());
            service.delete(id, ownerId);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}/make-listable")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ItemDTO> makeListable(@PathVariable UUID id, Principal principal) {
        try {
            UUID ownerId = UUID.fromString(principal.getName());
            return ResponseEntity.ok(service.makeListable(id, ownerId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return ResponseEntity.badRequest().body(errors);
    }
} 