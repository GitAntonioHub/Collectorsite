package com.Collectorsite.Backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class RedirectController {

    // Handle legacy endpoints and redirect them to the correct paths
    
    // Removing this conflicting endpoint as it's already handled by ItemController
    // @GetMapping("/api/items/my-items")
    // public ResponseEntity<Void> redirectApiItemsMyItems() {
    //     return ResponseEntity.status(301)
    //         .header("Location", "/api/my-items")
    //         .build();
    // }
    
    // Removing this conflicting endpoint as it's already handled by PublicItemsController
    // @GetMapping("/items/my-items")
    // public ResponseEntity<Void> redirectItemsMyItems() {
    //     return ResponseEntity.status(301)
    //         .header("Location", "/my-items")
    //         .build();
    // }
    
    @PostMapping("/items/my-items")
    public ResponseEntity<Void> redirectPostItemsMyItems() {
        return ResponseEntity.status(301)
            .header("Location", "/my-items")
            .build();
    }
} 