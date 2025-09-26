package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor 
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotEmpty(message = "First name cannot be empty")
    @Size(min = 2, max = 50, message = "First name must be 2-50 characters")
    @Column(nullable = false)
    private String firstName;

    @NotEmpty(message = "Last name cannot be empty") 
    @Size(min = 2, max = 50, message = "Last name must be 2-50 characters")
    @Column(nullable = false)
    private String lastName;

    @Email(message = "Invalid email format")
    @NotEmpty(message = "Email is mandatory")
    @Column(nullable = false, unique = true)
    private String email;
    
    @NotEmpty(message = "Password is mandatory")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$",
        message = "Password must contain: 1 uppercase, 1 lowercase, 1 number, 1 special character (@$!%*?&)"
    )
    @Column(nullable = false)
    private String password;
}
