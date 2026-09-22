package com.blogapp.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true)
    private String username;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    private String bio;

    private String gender;

    private String country;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(nullable = false)
    private String role = "user";

    @Column(name = "is_anonymous")
    private Boolean isAnonymous = false;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}