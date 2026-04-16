package com.cafeteria.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaleDTO {
    private Long id;
    private String saleCode;
    private String sellerName;
    private String saleDate;
    private String status;
    private List<SaleItemDTO> items;
}
