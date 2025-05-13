package com.Collectorsite.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Collectorsite.Backend.entity.Listing;
import com.Collectorsite.Backend.enums.ListingStatus;
import java.util.List;
import java.util.UUID;

public interface ListingRepository extends JpaRepository<Listing, UUID> {
    List<Listing> findByStatus(ListingStatus status);
    boolean existsByItem_IdAndStatus(UUID itemId, ListingStatus status);
}
