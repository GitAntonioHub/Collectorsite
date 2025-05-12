package com.Collectorsite.Backend.service;

import com.Collectorsite.Backend.dto.ItemDTO;
import java.util.UUID;
import java.util.List;

public interface ItemService {
    ItemDTO create(ItemDTO dto, UUID ownerId);
    ItemDTO get(UUID id);
    List<ItemDTO> list();
}
