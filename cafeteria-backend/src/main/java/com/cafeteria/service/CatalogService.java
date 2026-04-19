package com.cafeteria.service;

import com.cafeteria.dto.CatalogItemDTO;
import com.cafeteria.entity.CatalogItem;
import com.cafeteria.repository.CatalogItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CatalogService {
    private final CatalogItemRepository catalogItemRepository;

    public List<CatalogItemDTO> getItemsByCategory(String category) {
        return catalogItemRepository.findByCategoryOrderByNameAsc(category)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public CatalogItemDTO createItem(CatalogItemDTO request) {
        String normalizedName = request.getName() == null ? "" : request.getName().trim();
        String normalizedCategory = request.getCategory() == null ? "" : request.getCategory().trim().toLowerCase();

        if (normalizedName.isEmpty()) {
            throw new RuntimeException("Item name is required");
        }
        if (!List.of("dish", "drink", "dessert").contains(normalizedCategory)) {
            throw new RuntimeException("Invalid category");
        }

        CatalogItem existing = catalogItemRepository.findByNameAndCategory(normalizedName, normalizedCategory)
                .orElse(null);
        if (existing != null) {
            return toDTO(existing);
        }

        CatalogItem created = catalogItemRepository.save(CatalogItem.builder()
                .name(normalizedName)
                .category(normalizedCategory)
                .build());

        return toDTO(created);
    }

    public void initializeDefaultCatalogItems() {
        createItemIfMissing("Poisson Attiéké", "dish");
        createItemIfMissing("Poulet Pommes de terre", "dish");
        createItemIfMissing("Viande hachée Riz", "dish");

        createItemIfMissing("Coca-Cola", "drink");
        createItemIfMissing("Orangina", "drink");
        createItemIfMissing("Oasis", "drink");
        createItemIfMissing("Bissap", "drink");
        createItemIfMissing("Jus de gingembre", "drink");

        createItemIfMissing("Déguê", "dessert");
        createItemIfMissing("Cookies", "dessert");
        createItemIfMissing("Gâteau", "dessert");
    }

    private void createItemIfMissing(String name, String category) {
        if (catalogItemRepository.findByNameAndCategory(name, category).isEmpty()) {
            catalogItemRepository.save(CatalogItem.builder()
                    .name(name)
                    .category(category)
                    .build());
        }
    }

    private CatalogItemDTO toDTO(CatalogItem item) {
        return CatalogItemDTO.builder()
                .id(item.getId())
                .name(item.getName())
                .category(item.getCategory())
                .build();
    }
}
