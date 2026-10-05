package com.blogapp.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UpdateProfileRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @Size(max = 50, message = "Username must not exceed 50 characters")
    private String username;

    @Size(max = 300, message = "Bio must not exceed 300 characters")
    private String bio;

    private String country;

    @Override
    public String toString() {
        return "UpdateProfileRequest{" +
                "name='" + name + '\'' +
                ", username='" + username + '\'' +
                ", bio='" + bio + '\'' +
                ", country='" + country + '\'' +
                '}';
    }
}