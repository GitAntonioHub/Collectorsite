package com.Collectorsite.Backend.service;

import com.Collectorsite.Backend.dto.CreateListingDTO;
import com.Collectorsite.Backend.dto.ListingDTO;
import com.Collectorsite.Backend.enums.ListingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

/**
 * Business contract for listings.
 */
public interface ListingService {

    ListingDTO create(CreateListingDTO dto, UUID sellerId);

    ListingDTO close(UUID listingId, UUID sellerId);

    /** Public feed – paginated + keyword filter */
    Page<ListingDTO> feed(ListingStatus status, String keyword, Pageable pageable);

    /** Convenience method kept for backward‑compat with old UI */
    List<ListingDTO> listActive();

    ListingDTO get(UUID id);
}
