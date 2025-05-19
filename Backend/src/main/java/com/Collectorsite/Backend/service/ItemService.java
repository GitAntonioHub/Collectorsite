package com.Collectorsite.Backend.service;

import com.Collectorsite.Backend.dto.ItemDTO;
import java.util.UUID;
import java.util.List;

public interface ItemService {
    ItemDTO create(ItemDTO dto, UUID ownerId);
    ItemDTO get(UUID id);
    List<ItemDTO> list();
    ItemDTO update(ItemDTO dto, UUID ownerId);
    void delete(UUID id, UUID ownerId);
    ItemDTO makeListable(UUID id, UUID ownerId);
}
