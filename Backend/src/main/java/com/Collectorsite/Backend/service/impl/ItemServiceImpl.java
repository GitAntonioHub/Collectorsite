package com.Collectorsite.Backend.service.impl;

import com.Collectorsite.Backend.enums.ItemStatus;
import com.Collectorsite.Backend.service.ItemService;
import com.Collectorsite.Backend.dto.ItemDTO;
import com.Collectorsite.Backend.entity.*;
import com.Collectorsite.Backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.*;
import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final CollectorItemRepository itemRepo;
    private final AppUserRepository userRepo;
    private final VerificationRequestRepository verRepo;

    private ItemDTO map(CollectorItem item) {
        return ItemDTO.builder()
                .id(item.getId())
                .title(item.getTitle())
                .description(item.getDescription())
                .condition(item.getCondition())
                .year(item.getYear())
                .estimatedValue(item.getEstimatedValue())
                .status(item.getStatus())
                .build();
    }

    @Override
    public ItemDTO create(ItemDTO dto, UUID ownerId) {
        AppUser owner = userRepo.findById(ownerId).orElseThrow();

        CollectorItem item = CollectorItem.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .condition(dto.getCondition())
                .year(dto.getYear())
                .estimatedValue(dto.getEstimatedValue())
                .owner(owner)
                .status(ItemStatus.DRAFT)
                .build();

        itemRepo.save(item);
        verRepo.save(VerificationRequest.builder()
                .item(item)
                .requestedBy(owner)
                .build());

        return map(item);
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
    public ItemDTO update(ItemDTO dto, UUID ownerId) {
        CollectorItem item = itemRepo.findById(dto.getId()).orElseThrow();
        
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
}
