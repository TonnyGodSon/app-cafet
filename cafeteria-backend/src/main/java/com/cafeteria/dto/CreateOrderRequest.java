package com.cafeteria.dto;

import lombok.*;
import java.util.Map;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateOrderRequest {
    private String saleCode;
    private String customerFirstName;
    private List<OrderItemDTO> items;
    private String paymentMethod;
    private Map<String, Double> paymentBreakdown;
}
