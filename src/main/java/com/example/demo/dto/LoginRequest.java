package com.example.demo.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    
    @Email(message = "Invalid email format")
    @NotEmpty(message = "Email is mandatory")
    private String email;
    
    @NotEmpty(message = "Password is mandatory")
    private String password;
}