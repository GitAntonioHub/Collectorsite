package com.Collectorsite.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.Collectorsite.Backend.entity.CollectorItem;
import com.Collectorsite.Backend.enums.ItemStatus;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CollectorItemRepository extends JpaRepository<CollectorItem, UUID> {
    List<CollectorItem> findByOwnerId(UUID ownerId);
    
    // Find items by status
    Page<CollectorItem> findByStatus(ItemStatus status, Pageable pageable);
    
    // Use custom JPQL query with proper type handling
    @Query("SELECT i FROM CollectorItem i WHERE i.status = :status AND " +
           "(LOWER(i.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(CAST(i.description AS string)) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<CollectorItem> findByStatusAndKeyword(@Param("status") ItemStatus status, @Param("keyword") String keyword, Pageable pageable);
    
    // Get only IDs to avoid ResultSet extraction issues
    @Query("SELECT i.id FROM CollectorItem i")
    List<UUID> findAllIds();
}
