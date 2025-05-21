package com.Collectorsite.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Collectorsite.Backend.entity.CollectorItem;
import java.util.List;
import java.util.UUID;

public interface CollectorItemRepository extends JpaRepository<CollectorItem, UUID> {
    List<CollectorItem> findByOwnerId(UUID ownerId);
}
