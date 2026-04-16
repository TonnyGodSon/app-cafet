package com.cafeteria.api;

import com.cafeteria.dto.CreateSaleRequest;
import com.cafeteria.dto.SaleDTO;
import com.cafeteria.service.SaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sales")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class SaleController {
    private final SaleService saleService;

    @PostMapping
    public ResponseEntity<SaleDTO> createSale(@RequestBody CreateSaleRequest request) {
        try {
            SaleDTO sale = saleService.createSale(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(sale);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/{saleCode}")
    public ResponseEntity<SaleDTO> getSaleBySaleCode(@PathVariable String saleCode) {
        try {
            SaleDTO sale = saleService.getSaleBySaleCode(saleCode);
            return ResponseEntity.ok(sale);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PutMapping("/{saleCode}/close")
    public ResponseEntity<SaleDTO> closeSale(@PathVariable String saleCode) {
        try {
            SaleDTO sale = saleService.closeSale(saleCode);
            return ResponseEntity.ok(sale);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
