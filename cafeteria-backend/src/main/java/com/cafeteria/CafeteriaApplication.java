package com.cafeteria;

import com.cafeteria.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CafeteriaApplication {

    public static void main(String[] args) {
        SpringApplication.run(CafeteriaApplication.class, args);
    }

    @Bean
    CommandLineRunner init(UserService userService) {
        return args -> {
            // Initialize default users
            userService.initializeDefaultUsers();
            System.out.println("Default users initialized successfully!");
        };
    }
}
