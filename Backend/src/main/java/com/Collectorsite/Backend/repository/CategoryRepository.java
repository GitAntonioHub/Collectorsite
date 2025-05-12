package com.Collectorsite.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Collectorsite.Backend.entity.Category;
import java.util.UUID;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
}
