package com.cafeteria.config;

import com.cafeteria.service.CatalogService;
import com.cafeteria.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final UserService userService;
    private final CatalogService catalogService;

    @Override
    public void run(String... args) {
        userService.initializeDefaultUsers();
        catalogService.initializeDefaultCatalogItems();
        System.out.println("Default users and catalog initialized successfully!");
    }
}
