package com.cafeteria.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "catalog_items", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"name", "category"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CatalogItem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;
}
