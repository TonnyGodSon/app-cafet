package com.cafeteria.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CatalogItemDTO {
    private Long id;
    private String name;
    private String category;
}
