package com.cafeteria.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sale_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaleItem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sale_id", nullable = false)
    private Sale sale;

    @Column(nullable = false)
    private String productName;

    @Column(nullable = false)
    private String category; // dish, drink, dessert

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer quantity;
}
