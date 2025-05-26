package com.Collectorsite.Backend.service.impl;

import com.Collectorsite.Backend.enums.ItemStatus;
import com.Collectorsite.Backend.enums.ItemCondition;
import com.Collectorsite.Backend.enums.VerificationStatus;
import com.Collectorsite.Backend.service.ItemService;
import com.Collectorsite.Backend.dto.ItemDTO;
import com.Collectorsite.Backend.entity.*;
import com.Collectorsite.Backend.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.*;

import java.util.*;
import java.util.stream.Collectors;
import java.time.Instant;

@Slf4j
@Service @RequiredArgsConstructor
@Transactional
public class ItemServiceImpl implements ItemService {

    private final CollectorItemRepository itemRepo;
    private final AppUserRepository userRepo;
    private final VerificationRequestRepository verRepo;

    private ItemDTO map(CollectorItem item) {
        try {
            // Map images if they exist
            List<ItemDTO.ItemImageDTO> imageDTOs = new ArrayList<>();
            if (item.getImages() != null && !item.getImages().isEmpty()) {
                for (ItemImage image : item.getImages()) {
                    try {
                        imageDTOs.add(ItemDTO.ItemImageDTO.builder()
                            .id(image.getId())
                            .url(image.getUrl())
                            .isPrimary(image.getIsPrimary())
                            .build());
                    } catch (Exception e) {
                        log.warn("Error mapping image {}: {}", image.getId(), e.getMessage());
                        // Continue with next image
                    }
                }
            }
            
            // Safely get values with defensive fallbacks
            String title = "";
            String description = "";
            ItemCondition condition = null;
            Integer year = null;
            Double estimatedValue = null;
            ItemStatus status = ItemStatus.DRAFT;
            
            try { 
                title = item.getTitle() != null ? String.valueOf(item.getTitle()) : ""; 
            } catch (Exception e) {
                log.warn("Error converting title for item {}", item.getId());
            }
            
            try { 
                description = item.getDescription() != null ? String.valueOf(item.getDescription()) : ""; 
            } catch (Exception e) {
                log.warn("Error converting description for item {}", item.getId());
            }
            
            try { 
                condition = item.getCondition(); 
            } catch (Exception e) {
                log.warn("Error getting condition for item {}", item.getId());
            }
            
            try { 
                year = item.getYear(); 
            } catch (Exception e) {
                log.warn("Error getting year for item {}", item.getId());
            }
            
            try { 
                estimatedValue = item.getEstimatedValue(); 
            } catch (Exception e) {
                log.warn("Error getting estimatedValue for item {}", item.getId());
            }
            
            try { 
                status = item.getStatus() != null ? item.getStatus() : ItemStatus.DRAFT; 
            } catch (Exception e) {
                log.warn("Error getting status for item {}", item.getId());
            }
            
            return ItemDTO.builder()
                    .id(item.getId())
                    .ownerId(item.getOwner().getId())
                    .title(title)
                    .description(description)
                    .condition(condition)
                    .year(year)
                    .estimatedValue(estimatedValue)
                    .status(status)
                    .images(imageDTOs)
                    .build();
        } catch (Exception e) {
            log.error("Error mapping item with ID {}: {}", item.getId(), e.getMessage());
            throw new RuntimeException("Error processing item data: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public ItemDTO create(ItemDTO dto, UUID ownerId) {
        try {
            // Get the user explicitly with detailed error reporting
            AppUser owner = userRepo.findById(ownerId)
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + ownerId));
            
            System.out.println("Owner found: " + owner.getId() + ", username: " + owner.getUsername());

            // Create the item with explicit timestamps for both fields
            Instant now = Instant.now();
            CollectorItem item = CollectorItem.builder()
                    .title(dto.getTitle())
                    .description(dto.getDescription())
                    .condition(dto.getCondition())
                    .year(dto.getYear())
                    .estimatedValue(dto.getEstimatedValue())
                    .owner(owner)
                    .status(ItemStatus.DRAFT)
                    .createdAt(now)
                    .build();
            
            // Save item and get the saved entity with ID
            itemRepo.save(item);
            
            // Force immediate database insert with flush
            itemRepo.flush();
            
            // Re-fetch the item to ensure it's managed and has its ID
            CollectorItem persistedItem = itemRepo.findById(item.getId())
                .orElseThrow(() -> new RuntimeException("Failed to retrieve saved item with ID: " + item.getId()));

            System.out.println("Item re-fetched with ID: " + persistedItem.getId());

            // Create verification request
            VerificationRequest request = new VerificationRequest();
            request.setItem(persistedItem); // Use the re-fetched item
            request.setRequestedBy(owner);
            request.setStatus(VerificationStatus.PENDING);
            request.setRequestedAt(Instant.now());

            System.out.println("Saving verification request with item ID: " + persistedItem.getId() +
                    " and requestedBy ID: " + owner.getId());
                
            // Save verification request and flush to ensure it's written
            VerificationRequest savedRequest = verRepo.save(request);
            verRepo.flush();
            
            System.out.println("Verification request saved successfully with ID: " + savedRequest.getId());

            return map(persistedItem); // Use persistedItem for mapping
        } catch (Exception e) {
            System.out.println("Error creating item: " + e.getMessage());
            e.printStackTrace(); // Add stack trace for better debugging
            throw e;
        }
    }

    @Override
    public ItemDTO get(UUID id) {
        return itemRepo.findById(id).map(this::map).orElseThrow();
    }

    @Override
    public List<ItemDTO> list() {
        try {
            // Use a direct query with specific columns to avoid ResultSet extraction issues
            List<CollectorItem> allItems = new ArrayList<>();
            
            // Process items one by one to avoid batch issues
            for (UUID id : itemRepo.findAllIds()) {
                try {
                    Optional<CollectorItem> itemOpt = itemRepo.findById(id);
                    if (itemOpt.isPresent()) {
                        allItems.add(itemOpt.get());
                    }
                } catch (Exception e) {
                    log.error("Error retrieving item with id {}: {}", id, e.getMessage());
                    // Continue with next item
                }
            }
            
            List<ItemDTO> result = new ArrayList<>();
            for (CollectorItem item : allItems) {
                try {
                    result.add(map(item));
                } catch (Exception e) {
                    log.error("Error mapping item {}: {}", item.getId(), e.getMessage());
                    // Continue with next item
                }
            }
            
            return result;
        } catch (Exception e) {
            log.error("Error listing items", e);
            throw new RuntimeException("Failed to retrieve items: " + e.getMessage());
        }
    }

    @Override
    public ItemDTO update(UUID id, ItemDTO dto, UUID ownerId) {
        CollectorItem item = itemRepo.findById(id).orElseThrow();
        
        if (!item.getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("You are not authorized to update this item");
        }

        item.setTitle(dto.getTitle());
        item.setDescription(dto.getDescription());
        item.setCondition(dto.getCondition());
        item.setYear(dto.getYear());
        item.setEstimatedValue(dto.getEstimatedValue());

        itemRepo.save(item);
        return map(item);
    }

    @Override
    public void delete(UUID id, UUID ownerId) {
        CollectorItem item = itemRepo.findById(id).orElseThrow();
        
        if (!item.getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("You are not authorized to delete this item");
        }

        itemRepo.delete(item);
    }

    @Override
    public ItemDTO makeListable(UUID id, UUID ownerId) {
        CollectorItem item = itemRepo.findById(id).orElseThrow();
        
        if (!item.getOwner().getId().equals(ownerId)) {
            throw new RuntimeException("You are not authorized to modify this item");
        }

        if (!item.getStatus().equals(ItemStatus.DRAFT)) {
            throw new RuntimeException("Item must be in DRAFT status to make it listable");
        }

        item.setStatus(ItemStatus.AVAILABLE);
        itemRepo.save(item);
        return map(item);
    }
    
    @Override
    @Transactional
    public List<ItemDTO> getItemsByOwner(UUID ownerId) {
        return itemRepo.findByOwnerId(ownerId)
                .stream()
                .map(this::map)
                .collect(Collectors.toList());
    }
    
    @Override
    public ItemDTO verifyItem(UUID id) {
        CollectorItem item = itemRepo.findById(id).orElseThrow();
        AppUser owner = item.getOwner(); // Get the item's owner
        item.setStatus(ItemStatus.AVAILABLE);
        itemRepo.save(item);
        
        // Check if there are existing verification requests
        List<VerificationRequest> requests = verRepo.findByItemIdAndStatus(id, VerificationStatus.PENDING);
        
        if (requests.isEmpty()) {
            // If no requests exist, create one
            verRepo.save(VerificationRequest.builder()
                .item(item)
                .requestedBy(owner)  // Set the owner as the requester
                .status(VerificationStatus.APPROVED)
                .verifiedAt(new Date().toInstant())
                .build());
        } else {
            // Update existing requests
            for (VerificationRequest request : requests) {
                request.setStatus(VerificationStatus.APPROVED);
                request.setVerifiedAt(new Date().toInstant());
                verRepo.save(request);
            }
        }
        
        return map(item);
    }
    
    @Override
    public Page<ItemDTO> getAvailableItems(String keyword, ItemStatus status, Pageable pageable) {
        Page<CollectorItem> itemsPage;
        
        if (StringUtils.hasText(keyword)) {
            itemsPage = itemRepo.findByStatusAndKeyword(status, keyword, pageable);
        } else {
            itemsPage = itemRepo.findByStatus(status, pageable);
        }
        
        return itemsPage.map(this::map);
    }
}
