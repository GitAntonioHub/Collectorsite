// src/main/java/com/Collectorsite/Backend/repository/ListingRepository.java
package com.Collectorsite.Backend.repository;

import com.Collectorsite.Backend.entity.Listing;
import com.Collectorsite.Backend.enums.ListingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ListingRepository extends JpaRepository<Listing, UUID> {

    // For getActiveListings
    Page<Listing> findByStatusNotIn(List<ListingStatus> statuses, Pageable pageable);
    
    Page<Listing> findByStatusNotInAndItem_TitleContainingIgnoreCaseOrStatusNotInAndItem_DescriptionContainingIgnoreCase(
            List<ListingStatus> statuses1, String title,
            List<ListingStatus> statuses2, String description,
            Pageable pageable);

    // For feed endpoint
    Page<Listing> findByStatus(ListingStatus status, Pageable pageable);
    
    Page<Listing> findByStatusAndItem_TitleContainingIgnoreCaseOrStatusAndItem_DescriptionContainingIgnoreCase(
            ListingStatus status1, String title,
            ListingStatus status2, String description,
            Pageable pageable);
            
    // For listActive
    List<Listing> findByStatus(ListingStatus status);
}
