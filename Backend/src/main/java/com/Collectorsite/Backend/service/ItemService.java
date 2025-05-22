package com.Collectorsite.Backend.service;

import com.Collectorsite.Backend.dto.ItemDTO;
import com.Collectorsite.Backend.enums.ItemStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.UUID;
import java.util.List;

public interface ItemService {
    ItemDTO create(ItemDTO dto, UUID ownerId);
    ItemDTO get(UUID id);
    List<ItemDTO> list();
    ItemDTO update(UUID id, ItemDTO dto, UUID ownerId);
    void delete(UUID id, UUID ownerId);
    ItemDTO makeListable(UUID id, UUID ownerId);
    
    /**
     * Get items by owner ID
     */
    List<ItemDTO> getItemsByOwner(UUID ownerId);
    
    /**
     * Get items by status with pagination, filtering by keyword
     */
    Page<ItemDTO> getAvailableItems(String keyword, ItemStatus status, Pageable pageable);
    
    /**
     * Verify an item (for admin/verifier)
     */
    ItemDTO verifyItem(UUID id);
}
