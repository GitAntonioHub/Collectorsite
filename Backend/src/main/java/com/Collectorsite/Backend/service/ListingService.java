package com.Collectorsite.Backend.service;

import com.Collectorsite.Backend.dto.CreateListingDTO;
import com.Collectorsite.Backend.dto.ListingDTO;
import com.Collectorsite.Backend.dto.UpdateListingDTO;
import com.Collectorsite.Backend.enums.ListingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

/**
 * Business contract for listings.
 */
public interface ListingService {

    /**
     * Create a new listing
     */
    ListingDTO create(CreateListingDTO dto, UUID sellerId);

    /**
     * Update an existing listing
     */
    ListingDTO update(UUID id, UpdateListingDTO dto, UUID sellerId);

    /**
     * Close a listing
     */
    ListingDTO close(UUID listingId, UUID sellerId);

    /**
     * Get a specific listing
     */
    ListingDTO get(UUID id);

    /**
     * Get active listings (not SOLD or TRADED)
     * Supports pagination and sorting
     */
    Page<ListingDTO> getActiveListings(String search, Pageable pageable);

    /** Public feed – paginated + keyword filter + sorting */
    Page<ListingDTO> feed(ListingStatus status, String keyword, Pageable pageable);

    /** Convenience method kept for backward‑compat with old UI */
    List<ListingDTO> listActive();
    
    /**
     * Get listings by seller ID
     */
    Page<ListingDTO> getListingsBySeller(UUID sellerId, Pageable pageable);
    
    /**
     * Delete a listing
     */
    void delete(UUID listingId, UUID sellerId);
}
