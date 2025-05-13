package com.Collectorsite.Backend.service;

import com.Collectorsite.Backend.dto.CreateListingDTO;
import com.Collectorsite.Backend.dto.ListingDTO;
import java.util.List;
import java.util.UUID;

public interface ListingService {
    ListingDTO create(CreateListingDTO dto, UUID sellerId);
    ListingDTO close(UUID listingId, UUID sellerId);
    List<ListingDTO> listActive();
    ListingDTO get(UUID id);
}
