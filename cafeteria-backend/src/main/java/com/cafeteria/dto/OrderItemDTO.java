package com.cafeteria.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDTO {
    private String productName;
    private String category;
    private Double price;
    private Integer quantity;
}
