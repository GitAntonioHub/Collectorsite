package com.Collectorsite.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Collectorsite.Backend.entity.CollectorItem;
import java.util.UUID;

public interface CollectorItemRepository extends JpaRepository<CollectorItem, UUID> {
}
