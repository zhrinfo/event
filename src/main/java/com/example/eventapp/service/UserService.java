package com.example.eventapp.service;

import com.example.eventapp.model.Role;
import com.example.eventapp.model.User;
import com.example.eventapp.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(String email, String rawPassword, String fullName) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already used");
        }
        User u = new User();
        u.setEmail(email);
        u.setPassword(passwordEncoder.encode(rawPassword));
        u.setFullName(fullName);
        u.setRoles(Collections.singleton(Role.ROLE_USER));
        return userRepository.save(u);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public User updateProfile(Long id, String fullName) {
        User u = userRepository.findById(id).orElseThrow();
        u.setFullName(fullName);
        return userRepository.save(u);
    }
}
