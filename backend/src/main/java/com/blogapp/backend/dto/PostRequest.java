package com.blogapp.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class PostRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    private String coverImage;

    @NotBlank(message = "Genre is required")
    private String genre;

    private String status;
    private Boolean isAnonymous;
}