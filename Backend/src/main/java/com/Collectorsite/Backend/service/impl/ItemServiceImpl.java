package com.Collectorsite.Backend.service.impl;

import com.Collectorsite.Backend.enums.ItemStatus;
import com.Collectorsite.Backend.enums.VerificationStatus;
import com.Collectorsite.Backend.service.ItemService;
import com.Collectorsite.Backend.dto.ItemDTO;
import com.Collectorsite.Backend.entity.*;
import com.Collectorsite.Backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.*;
import java.util.stream.Collectors;
import java.time.Instant;

@Service @RequiredArgsConstructor
@Transactional
public class ItemServiceImpl implements ItemService {

    private final CollectorItemRepository itemRepo;
    private final AppUserRepository userRepo;
    private final VerificationRequestRepository verRepo;

    private ItemDTO map(CollectorItem item) {
        // Map images if they exist
        List<ItemDTO.ItemImageDTO> imageDTOs = new ArrayList<>();
        if (item.getImages() != null && !item.getImages().isEmpty()) {
            imageDTOs = item.getImages().stream()
                .map(image -> ItemDTO.ItemImageDTO.builder()
                    .id(image.getId())
                    .url(image.getUrl())
                    .isPrimary(image.getIsPrimary())
                    .build())
                .collect(Collectors.toList());
        }
        
        return ItemDTO.builder()
                .id(item.getId())
                .ownerId(item.getOwner().getId())
                .title(item.getTitle())
                .description(item.getDescription())
                .condition(item.getCondition())
                .year(item.getYear())
                .estimatedValue(item.getEstimatedValue())
                .status(item.getStatus())
                .images(imageDTOs)
                .build();
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
            
            // Explicitly set the duplicate field
            item.setCreatedAtDuplicate(now);

            // Save item and get the saved entity with ID
            CollectorItem savedItem = itemRepo.save(item);
            
            // Force immediate database insert with flush
            itemRepo.flush();
            
            System.out.println("Item saved with ID: " + savedItem.getId());

            // Create verification request - explicitly copy the saved item ID instead of using entity reference
            VerificationRequest request = new VerificationRequest();
            request.setItem(savedItem);
            request.setRequestedBy(owner);
            request.setRequestedByUUID(owner.getId());
            request.setStatus(VerificationStatus.PENDING);
            request.setRequestedAt(Instant.now());

            System.out.println("Saving verification request with item ID: " + savedItem.getId() + 
                    " and requestedBy ID: " + owner.getId());
                
            // Save verification request and flush to ensure it's written
            VerificationRequest savedRequest = verRepo.save(request);
            verRepo.flush();
            
            System.out.println("Verification request saved successfully with ID: " + savedRequest.getId());

            return map(savedItem);
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
        return itemRepo.findAll().stream().map(this::map).collect(Collectors.toList());
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
        // If we have a keyword, use it to filter items by title or description
        List<CollectorItem> filteredItems;
        
        if (StringUtils.hasText(keyword)) {
            // Use the new repository method
            filteredItems = itemRepo.findByStatusAndKeyword(status, keyword);
        } else {
            // Just get items by status
            filteredItems = itemRepo.findByStatus(status);
        }
        
        // Convert to DTOs
        List<ItemDTO> itemDTOs = filteredItems.stream()
            .map(this::map)
            .collect(Collectors.toList());
            
        // Manual pagination
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), itemDTOs.size());
        
        // Check bounds
        if (start > itemDTOs.size()) {
            start = 0;
            end = Math.min(pageable.getPageSize(), itemDTOs.size());
        }
        
        // Create sublist for pagination
        List<ItemDTO> pageContent = itemDTOs.subList(start, end);
        
        return new PageImpl<>(pageContent, pageable, itemDTOs.size());
    }
}
