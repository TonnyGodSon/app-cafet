package com.cafeteria.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateSaleRequest {
    private String sellerName;
    private String saleDate;
    private java.util.List<SaleItemDTO> dishes;
    private java.util.List<SaleItemDTO> drinks;
    private java.util.List<SaleItemDTO> desserts;
}
