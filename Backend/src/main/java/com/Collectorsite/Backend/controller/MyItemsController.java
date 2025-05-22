package com.Collectorsite.Backend.controller;

import com.Collectorsite.Backend.dto.CreateListingDTO;
import com.Collectorsite.Backend.dto.ItemDTO;
import com.Collectorsite.Backend.dto.ListingDTO;
import com.Collectorsite.Backend.enums.ListingType;
import com.Collectorsite.Backend.service.ItemService;
import com.Collectorsite.Backend.service.ListingService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController 
@RequestMapping("/my-items") 
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class MyItemsController {

    private final ItemService service;
    private final ListingService listingService;
    
    // Data transfer object for listing an item for sale
    @Data
    public static class ListForSaleDTO {
        @NotNull(message = "Item ID is required")
        private UUID itemId;
        
        @NotNull(message = "Price is required")
        @Positive(message = "Price must be greater than zero")
        private Double price;
        
        private String currency = "USD";
    }

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
    
    @PostMapping("/list-for-sale")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ListingDTO> listForSale(
            @Valid @RequestBody ListForSaleDTO dto,
            Principal principal) {
        try {
            UUID sellerId = UUID.fromString(principal.getName());
            
            // Create a proper CreateListingDTO object
            CreateListingDTO createDto = new CreateListingDTO();
            createDto.setItemId(dto.getItemId());
            createDto.setPrice(BigDecimal.valueOf(dto.getPrice()));
            createDto.setCurrency(dto.getCurrency());
            createDto.setListingType(ListingType.SALE);
            
            // Create listing and set item status to AVAILABLE
            ListingDTO listing = listingService.create(createDto, sellerId);
            
            return ResponseEntity.ok(listing);
        } catch (Exception e) {
            // Log the error for debugging
            System.err.println("Error listing item for sale: " + e.getMessage());
            e.printStackTrace();
            
            // Return error response
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
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