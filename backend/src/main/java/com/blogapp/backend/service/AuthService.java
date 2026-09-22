package com.blogapp.backend.service;

import com.blogapp.backend.security.JwtUtil;
import com.blogapp.backend.dto.AuthRequest;
import com.blogapp.backend.dto.AuthResponse;
import com.blogapp.backend.model.User;
import com.blogapp.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse register(AuthRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (request.getUsername() != null && userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUsername(request.getUsername());
        user.setGender(request.getGender());
        user.setCountry(request.getCountry());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setRole("user");

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(user.getId(), token, user.getRole(), user.getName(), user.getEmail());
    }

    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByUsernameOrEmail(request.getUsername(), request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(user.getId(), token, user.getRole(), user.getName(), user.getEmail());
    }
}