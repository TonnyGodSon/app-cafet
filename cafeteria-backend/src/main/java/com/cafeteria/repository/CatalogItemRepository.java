package com.cafeteria.repository;

import com.cafeteria.entity.CatalogItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CatalogItemRepository extends JpaRepository<CatalogItem, Long> {
    List<CatalogItem> findByCategoryOrderByNameAsc(String category);
    Optional<CatalogItem> findByNameAndCategory(String name, String category);
}
