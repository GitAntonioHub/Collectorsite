package com.Collectorsite.Backend.controller;

import com.Collectorsite.Backend.dto.ItemDTO;
import com.Collectorsite.Backend.service.ItemService;
import com.Collectorsite.Backend.enums.ItemStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
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
    public ResponseEntity<?> list() {
        try {
            // Get all items and filter to only return AVAILABLE and LISTED items
            List<ItemDTO> allItems = service.list();
            
            // If we get here, we successfully retrieved items
            List<ItemDTO> availableItems = allItems.stream()
                .filter(item -> item.getStatus() == ItemStatus.AVAILABLE || item.getStatus() == ItemStatus.LISTED)
                .collect(Collectors.toList());
            
            log.info("Successfully retrieved {} available items", availableItems.size());
            return ResponseEntity.ok(availableItems);
        } catch (Exception e) {
            // Log the full error with stack trace for debugging
            log.error("Error getting items list", e);
            
            // Return error response with details
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("timestamp", new Date().toString());
            return ResponseEntity.status(500).body(errorResponse);
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
    
    // Add a redirect for /items/my-items to point users to the correct endpoint
    @GetMapping("/my-items")
    public ResponseEntity<Void> redirectMyItems() {
        return ResponseEntity.status(301)
            .header("Location", "/my-items")
            .build();
    }
    
    @GetMapping("/available")
    public ResponseEntity<Page<ItemDTO>> getAvailableItems(
            @RequestParam(defaultValue = "") String q, 
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort,
            @RequestParam(defaultValue = "AVAILABLE") String status) {
        
        try {
            // Parse sort parameter
            String[] sortParams = sort.split(",");
            String sortField = sortParams[0];
            Sort.Direction direction = sortParams.length > 1 && sortParams[1].equalsIgnoreCase("asc") ? 
                    Sort.Direction.ASC : Sort.Direction.DESC;
            
            // Create pageable object
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortField));
            
            // Parse status parameter with fallback to AVAILABLE
            ItemStatus itemStatus;
            try {
                itemStatus = ItemStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                // If "ACTIVE" is passed, map it to AVAILABLE
                if ("ACTIVE".equalsIgnoreCase(status)) {
                    itemStatus = ItemStatus.AVAILABLE;
                } else {
                    itemStatus = ItemStatus.AVAILABLE; // Default fallback
                }
            }
            
            // Get paginated and filtered items
            Page<ItemDTO> items = service.getAvailableItems(q, itemStatus, pageable);
            
            return ResponseEntity.ok(items);
        } catch (Exception e) {
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