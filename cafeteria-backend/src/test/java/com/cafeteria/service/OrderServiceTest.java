package com.cafeteria.service;

import com.cafeteria.dto.CreateOrderRequest;
import com.cafeteria.dto.OrderDTO;
import com.cafeteria.dto.OrderItemDTO;
import com.cafeteria.entity.Order;
import com.cafeteria.entity.Sale;
import com.cafeteria.entity.User;
import com.cafeteria.repository.OrderRepository;
import com.cafeteria.repository.SaleRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private SaleRepository saleRepository;

    @InjectMocks
    private OrderService orderService;

    @Test
    void createOrder_shouldComputeTotalAndMapBreakdown() {
        orderService = new OrderService(orderRepository, saleRepository, new ObjectMapper());

        User seller = User.builder()
                .id(1L)
                .firstName("Mistura")
                .phoneNumber("0758297734")
                .isActive(true)
                .build();

        Sale sale = Sale.builder()
                .id(2L)
                .saleCode("SALE-001")
                .seller(seller)
                .saleDate(LocalDateTime.now())
                .status("open")
                .build();

        CreateOrderRequest request = CreateOrderRequest.builder()
                .saleCode("SALE-001")
                .customerFirstName("  Sarah ")
                .paymentMethod("Mixte")
                .paymentBreakdown(Map.of("CB", 5.0, "Espèces", 7.5))
                .items(List.of(
                        OrderItemDTO.builder().productName("Poisson").category("dish").price(7.5).quantity(1).build(),
                        OrderItemDTO.builder().productName("Coca-Cola").category("drink").price(2.5).quantity(2).build()
                ))
                .build();

        when(saleRepository.findBySaleCode("SALE-001")).thenReturn(Optional.of(sale));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order saved = invocation.getArgument(0);
            saved.setId(10L);
            saved.setCreatedAt(LocalDateTime.now());
            return saved;
        });

        OrderDTO result = orderService.createOrder(request);

        assertEquals("SALE-001", result.getSaleCode());
        assertEquals("Sarah", result.getCustomerFirstName());
        assertEquals("Mistura", result.getSellerName());
        assertEquals(12.5, result.getTotalPrice());
        assertEquals(5.0, result.getPaymentBreakdown().get("CB"));
        assertEquals(7.5, result.getPaymentBreakdown().get("Espèces"));

        ArgumentCaptor<Order> captor = ArgumentCaptor.forClass(Order.class);
        verify(orderRepository).save(captor.capture());
        assertEquals(2, captor.getValue().getItems().size());
        assertEquals(12.5, captor.getValue().getTotalPrice());
    }

    @Test
    void createOrder_shouldThrow_whenCustomerFirstNameMissing() {
        orderService = new OrderService(orderRepository, saleRepository, new ObjectMapper());

        Sale sale = Sale.builder()
                .id(3L)
                .saleCode("SALE-002")
                .seller(User.builder().firstName("Kaissy").phoneNumber("0780862724").isActive(true).build())
                .saleDate(LocalDateTime.now())
                .status("open")
                .build();

        CreateOrderRequest request = CreateOrderRequest.builder()
                .saleCode("SALE-002")
                .customerFirstName("   ")
                .paymentMethod("CB")
                .items(List.of(OrderItemDTO.builder().productName("Cookie").category("dessert").price(2.0).quantity(1).build()))
                .build();

        when(saleRepository.findBySaleCode("SALE-002")).thenReturn(Optional.of(sale));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> orderService.createOrder(request));

        assertTrue(ex.getMessage().contains("Customer first name is required"));
    }
}
