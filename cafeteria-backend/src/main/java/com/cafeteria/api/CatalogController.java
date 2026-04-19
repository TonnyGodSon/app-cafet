package com.cafeteria.api;

import com.cafeteria.dto.CatalogItemDTO;
import com.cafeteria.service.CatalogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/catalog")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowed-origins}")
public class CatalogController {
    private final CatalogService catalogService;

    @GetMapping("/items")
    public ResponseEntity<List<CatalogItemDTO>> getItemsByCategory(@RequestParam String category) {
        return ResponseEntity.ok(catalogService.getItemsByCategory(category));
    }

    @PostMapping("/items")
    public ResponseEntity<CatalogItemDTO> createItem(@RequestBody CatalogItemDTO request) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(catalogService.createItem(request));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
}
