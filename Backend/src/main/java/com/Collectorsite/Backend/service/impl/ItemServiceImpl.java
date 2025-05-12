package com.Collectorsite.Backend.service.impl;

import com.Collectorsite.Backend.service.ItemService;
import com.Collectorsite.Backend.dto.ItemDTO;
import com.Collectorsite.Backend.entity.*;
import com.Collectorsite.Backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final CollectorItemRepository itemRepo;
    private final AppUserRepository userRepo;

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
                .build();

        itemRepo.save(item);
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
}
