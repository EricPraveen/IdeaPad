package com.blogapp.backend.dto;

import lombok.Data;
import lombok.AllArgsConstructor;

@Data
@AllArgsConstructor
public class AuthResponse {
    private Long id;
    private String token;
    private String role;
    private String name;
    private String email;
}