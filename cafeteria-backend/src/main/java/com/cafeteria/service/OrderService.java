package com.cafeteria.service;

import com.cafeteria.dto.*;
import com.cafeteria.entity.Order;
import com.cafeteria.entity.OrderItem;
import com.cafeteria.entity.Sale;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.cafeteria.repository.OrderRepository;
import com.cafeteria.repository.SaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final SaleRepository saleRepository;
        private final ObjectMapper objectMapper;

    public OrderDTO createOrder(CreateOrderRequest request) {
        Sale sale = saleRepository.findBySaleCode(request.getSaleCode())
                .orElseThrow(() -> new RuntimeException("Sale not found: " + request.getSaleCode()));

        if (request.getCustomerFirstName() == null || request.getCustomerFirstName().trim().isEmpty()) {
            throw new RuntimeException("Customer first name is required");
        }

        Double totalPrice = request.getItems().stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();

        Order order = Order.builder()
                .sale(sale)
                .customerFirstName(request.getCustomerFirstName().trim())
                .paymentMethod(request.getPaymentMethod())
                .paymentBreakdownJson(serializePaymentBreakdown(request.getPaymentBreakdown()))
                .totalPrice(totalPrice)
                .build();

        // Add items
        List<OrderItem> items = request.getItems().stream()
                .map(dto -> OrderItem.builder()
                        .order(order)
                        .productName(dto.getProductName())
                        .category(dto.getCategory())
                        .price(dto.getPrice())
                        .quantity(dto.getQuantity())
                        .build())
                .collect(Collectors.toList());

        order.setItems(items);
        Order savedOrder = orderRepository.save(order);

        return convertToDTO(savedOrder);
    }

    public List<OrderDTO> getOrdersBySaleCode(String saleCode) {
        return orderRepository.findBySaleSaleCode(saleCode)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private OrderDTO convertToDTO(Order order) {
        return OrderDTO.builder()
                .id(order.getId())
                .saleCode(order.getSale().getSaleCode())
                .customerFirstName(order.getCustomerFirstName())
                .sellerName(order.getSale().getSeller().getFirstName())
                .items(order.getItems().stream()
                        .map(item -> OrderItemDTO.builder()
                                .productName(item.getProductName())
                                .category(item.getCategory())
                                .price(item.getPrice())
                                .quantity(item.getQuantity())
                                .build())
                        .collect(Collectors.toList()))
                .paymentMethod(order.getPaymentMethod())
                                .paymentBreakdown(deserializePaymentBreakdown(order.getPaymentBreakdownJson()))
                .totalPrice(order.getTotalPrice())
                .createdAt(order.getCreatedAt().format(
                        DateTimeFormatter.ISO_DATE_TIME))
                .build();
    }

        private String serializePaymentBreakdown(Map<String, Double> paymentBreakdown) {
                if (paymentBreakdown == null || paymentBreakdown.isEmpty()) {
                        return null;
                }
                try {
                        return objectMapper.writeValueAsString(paymentBreakdown);
                } catch (Exception ex) {
                        throw new RuntimeException("Unable to serialize payment breakdown", ex);
                }
        }

        private Map<String, Double> deserializePaymentBreakdown(String paymentBreakdownJson) {
                if (paymentBreakdownJson == null || paymentBreakdownJson.isBlank()) {
                        return Collections.emptyMap();
                }
                try {
                        return objectMapper.readValue(paymentBreakdownJson, new TypeReference<Map<String, Double>>() {});
                } catch (Exception ex) {
                        return Collections.emptyMap();
                }
        }
}
