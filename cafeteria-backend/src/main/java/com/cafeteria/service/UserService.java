package com.cafeteria.service;

import com.cafeteria.dto.UserDTO;
import com.cafeteria.entity.User;
import com.cafeteria.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public UserDTO authenticateUser(String firstName, String phoneNumber) {
        User user = userRepository.findByFirstNameAndPhoneNumber(firstName, phoneNumber)
                .orElse(null);
        return user != null ? convertToDTO(user) : null;
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public UserDTO getUserByName(String firstName) {
        User user = userRepository.findByFirstName(firstName).orElse(null);
        return user != null ? convertToDTO(user) : null;
    }

    public void initializeDefaultUsers() {
        if (userRepository.count() == 0) {
            User user1 = User.builder()
                    .firstName("Mistura")
                    .phoneNumber("0758297734")
                    .isActive(true)
                    .build();
            User user2 = User.builder()
                    .firstName("Kaissy")
                    .phoneNumber("0780862724")
                    .isActive(true)
                    .build();
            User user3 = User.builder()
                    .firstName("Antoine")
                    .phoneNumber("0767292866")
                    .isActive(true)
                    .build();
            userRepository.saveAll(List.of(user1, user2, user3));
        }
    }

    private UserDTO convertToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .phoneNumber(user.getPhoneNumber())
                .build();
    }
}
