package com.cafeteria.dto;

import lombok.*;
import java.util.Map;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDTO {
    private Long id;
    private String saleCode;
    private String customerFirstName;
    private String sellerName;
    private List<OrderItemDTO> items;
    private String paymentMethod;
    private Map<String, Double> paymentBreakdown;
    private Double totalPrice;
    private String createdAt;
}
