package com.blogapp.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.blogapp.backend.dto.ChangePasswordRequest;
import com.blogapp.backend.dto.UpdateProfileRequest;
import com.blogapp.backend.model.User;
import com.blogapp.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateProfile(String email, UpdateProfileRequest request) {
        try {
            System.out.println("[UserService] Updating profile for email: " + email);
            System.out.println("[UserService] Request: " + request);
            
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            System.out.println("[UserService] Found user: " + user.getEmail());

            // Only update username if it's provided and changed
            if (request.getUsername() != null && !request.getUsername().trim().isEmpty()) {
                if (!request.getUsername().equals(user.getUsername()) &&
                        userRepository.existsByUsername(request.getUsername())) {
                    throw new RuntimeException("Username already taken");
                }
                user.setUsername(request.getUsername());
            }

            // Update other fields if provided
            if (request.getName() != null && !request.getName().trim().isEmpty()) {
                user.setName(request.getName());
            }
            if (request.getBio() != null) {
                user.setBio(request.getBio());
            }
            if (request.getCountry() != null && !request.getCountry().trim().isEmpty()) {
                user.setCountry(request.getCountry());
            }
            
            System.out.println("[UserService] Saving updated user...");
            User savedUser = userRepository.save(user);
            System.out.println("[UserService] User saved successfully");
            return savedUser;
        } catch (Exception e) {
            System.err.println("[UserService] Error updating profile: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public String changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("New passwords do not match");
        }

        if (request.getNewPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return "Password changed successfully";
    }
}