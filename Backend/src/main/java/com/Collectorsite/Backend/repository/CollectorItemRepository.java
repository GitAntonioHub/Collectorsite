package com.Collectorsite.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.Collectorsite.Backend.entity.CollectorItem;
import com.Collectorsite.Backend.enums.ItemStatus;
import java.util.List;
import java.util.UUID;

public interface CollectorItemRepository extends JpaRepository<CollectorItem, UUID> {
    List<CollectorItem> findByOwnerId(UUID ownerId);
    
    // Find items by status
    List<CollectorItem> findByStatus(ItemStatus status);
    
    // Use custom JPQL query instead of method name to avoid CLOB issues
    @Query("SELECT i FROM CollectorItem i WHERE i.status = :status AND " +
           "(LOWER(CAST(i.title AS string)) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(CAST(i.description AS string)) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "ORDER BY i.createdAt DESC")
    List<CollectorItem> findByStatusAndKeyword(@Param("status") ItemStatus status, @Param("keyword") String keyword);
}
