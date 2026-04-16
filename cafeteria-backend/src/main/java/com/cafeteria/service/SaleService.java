package com.cafeteria.service;

import com.cafeteria.dto.*;
import com.cafeteria.entity.Sale;
import com.cafeteria.entity.SaleItem;
import com.cafeteria.entity.User;
import com.cafeteria.repository.SaleRepository;
import com.cafeteria.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SaleService {
    private final SaleRepository saleRepository;
    private final UserRepository userRepository;

    public SaleDTO createSale(CreateSaleRequest request) {
        User seller = userRepository.findByFirstName(request.getSellerName())
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        String saleCode = generateSaleCode();
        LocalDateTime saleDate = LocalDateTime.parse(request.getSaleDate(), 
                DateTimeFormatter.ISO_DATE_TIME);

        Sale sale = Sale.builder()
                .saleCode(saleCode)
                .seller(seller)
                .saleDate(saleDate)
                .status("open")
                .build();

        // Add items
        List<SaleItem> items = new java.util.ArrayList<>();
        items.addAll(createSaleItems(sale, request.getDishes(), "dish"));
        items.addAll(createSaleItems(sale, request.getDrinks(), "drink"));
        items.addAll(createSaleItems(sale, request.getDesserts(), "dessert"));

        sale.setItems(items);
        Sale savedSale = saleRepository.save(sale);

        return convertToDTO(savedSale);
    }

    public SaleDTO getSaleBySaleCode(String saleCode) {
        Sale sale = saleRepository.findBySaleCode(saleCode)
                .orElseThrow(() -> new RuntimeException("Sale not found: " + saleCode));
        return convertToDTO(sale);
    }

    public SaleDTO closeSale(String saleCode) {
        Sale sale = saleRepository.findBySaleCode(saleCode)
                .orElseThrow(() -> new RuntimeException("Sale not found: " + saleCode));
        sale.setStatus("closed");
        Sale updatedSale = saleRepository.save(sale);
        return convertToDTO(updatedSale);
    }

    public String generateSaleCode() {
        return String.format("%04d", (int) (Math.random() * 10000));
    }

    private List<SaleItem> createSaleItems(Sale sale, List<SaleItemDTO> itemDTOs, String category) {
        if (itemDTOs == null || itemDTOs.isEmpty()) return new java.util.ArrayList<>();
        return itemDTOs.stream()
                .map(dto -> SaleItem.builder()
                        .sale(sale)
                        .productName(dto.getProductName())
                        .category(category)
                        .price(dto.getPrice())
                        .quantity(dto.getQuantity())
                        .build())
                .collect(Collectors.toList());
    }

    private SaleDTO convertToDTO(Sale sale) {
        return SaleDTO.builder()
                .id(sale.getId())
                .saleCode(sale.getSaleCode())
                .sellerName(sale.getSeller().getFirstName())
                .saleDate(sale.getSaleDate().toString())
                .status(sale.getStatus())
                .items(sale.getItems().stream()
                        .map(item -> SaleItemDTO.builder()
                                .id(item.getId())
                                .productName(item.getProductName())
                                .category(item.getCategory())
                                .price(item.getPrice())
                                .quantity(item.getQuantity())
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }
}
