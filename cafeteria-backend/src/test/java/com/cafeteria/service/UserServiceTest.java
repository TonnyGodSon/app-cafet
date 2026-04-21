package com.cafeteria.service;

import com.cafeteria.dto.UserDTO;
import com.cafeteria.entity.User;
import com.cafeteria.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    void createUser_shouldCreateTrimmedUser_whenInputIsValid() {
        when(userRepository.findByFirstName("Alice")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User saved = invocation.getArgument(0);
            saved.setId(1L);
            return saved;
        });

        UserDTO result = userService.createUser("  Alice  ", " 0700000000 ");

        assertEquals("Alice", result.getFirstName());
        assertEquals("0700000000", result.getPhoneNumber());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void createUser_shouldReturnExistingUser_whenFirstNameAlreadyExists() {
        User existing = User.builder()
                .id(9L)
                .firstName("Kaissy")
                .phoneNumber("0780862724")
                .isActive(true)
                .build();
        when(userRepository.findByFirstName("Kaissy")).thenReturn(Optional.of(existing));

        UserDTO result = userService.createUser("Kaissy", "0799999999");

        assertEquals(9L, result.getId());
        assertEquals("Kaissy", result.getFirstName());
        assertEquals("0780862724", result.getPhoneNumber());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void createUser_shouldThrow_whenFirstNameOrPhoneMissing() {
        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> userService.createUser(" ", ""));

        assertTrue(ex.getMessage().contains("required"));
        verify(userRepository, never()).save(any(User.class));
    }
}
