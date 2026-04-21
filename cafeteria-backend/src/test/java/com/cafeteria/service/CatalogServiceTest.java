package com.cafeteria.service;

import com.cafeteria.dto.CatalogItemDTO;
import com.cafeteria.entity.CatalogItem;
import com.cafeteria.repository.CatalogItemRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CatalogServiceTest {

    @Mock
    private CatalogItemRepository catalogItemRepository;

    @InjectMocks
    private CatalogService catalogService;

    @Test
    void createItem_shouldCreateNormalizedItem_whenValidRequest() {
        CatalogItemDTO request = CatalogItemDTO.builder()
                .name("  Thiakry  ")
                .category("  Dessert  ")
                .build();

        when(catalogItemRepository.findByNameAndCategory("Thiakry", "dessert"))
                .thenReturn(Optional.empty());
        when(catalogItemRepository.save(any(CatalogItem.class))).thenAnswer(invocation -> {
            CatalogItem item = invocation.getArgument(0);
            item.setId(33L);
            return item;
        });

        CatalogItemDTO result = catalogService.createItem(request);

        assertEquals(33L, result.getId());
        assertEquals("Thiakry", result.getName());
        assertEquals("dessert", result.getCategory());
    }

    @Test
    void createItem_shouldReturnExistingItem_whenAlreadyExists() {
        CatalogItem existing = CatalogItem.builder()
                .id(7L)
                .name("Coca-Cola")
                .category("drink")
                .build();
        CatalogItemDTO request = CatalogItemDTO.builder()
                .name("Coca-Cola")
                .category("drink")
                .build();

        when(catalogItemRepository.findByNameAndCategory("Coca-Cola", "drink"))
                .thenReturn(Optional.of(existing));

        CatalogItemDTO result = catalogService.createItem(request);

        assertEquals(7L, result.getId());
        assertEquals("Coca-Cola", result.getName());
        verify(catalogItemRepository, never()).save(any(CatalogItem.class));
    }

    @Test
    void createItem_shouldThrow_whenCategoryInvalid() {
        CatalogItemDTO request = CatalogItemDTO.builder()
                .name("Produit X")
                .category("snack")
                .build();

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> catalogService.createItem(request));

        assertTrue(ex.getMessage().contains("Invalid category"));
        verify(catalogItemRepository, never()).save(any(CatalogItem.class));
    }
}
