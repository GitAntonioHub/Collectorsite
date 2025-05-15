// src/main/java/com/Collectorsite/Backend/repository/ListingRepository.java
package com.Collectorsite.Backend.repository;

import com.Collectorsite.Backend.entity.Listing;
import com.Collectorsite.Backend.enums.ListingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ListingRepository extends JpaRepository<Listing, UUID> {

    // already had:
    Page<Listing> findByStatus(ListingStatus status, Pageable pageable);

    // new – free-text search on item title OR description
    Page<Listing> findByStatusAndItem_TitleContainingIgnoreCaseOrStatusAndItem_DescriptionContainingIgnoreCase(
            ListingStatus status1, String title,
            ListingStatus status2, String description,
            Pageable pageable);
}
