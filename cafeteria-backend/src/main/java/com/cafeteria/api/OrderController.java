package com.cafeteria.api;

import com.cafeteria.dto.CreateOrderRequest;
import com.cafeteria.dto.OrderDTO;
import com.cafeteria.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@RequestBody CreateOrderRequest request) {
        try {
            OrderDTO order = orderService.createOrder(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(order);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/sale/{saleCode}")
    public ResponseEntity<List<OrderDTO>> getOrdersBySaleCode(@PathVariable String saleCode) {
        try {
            List<OrderDTO> orders = orderService.getOrdersBySaleCode(saleCode);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
