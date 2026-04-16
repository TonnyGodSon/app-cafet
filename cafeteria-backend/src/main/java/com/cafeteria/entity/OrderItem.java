package com.cafeteria.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private String category; // dish, drink, dessert

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer quantity;

    public Double getSubtotal() {
        return price * quantity;
    }
}
