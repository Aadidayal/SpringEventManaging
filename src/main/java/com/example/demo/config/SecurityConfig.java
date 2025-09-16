package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for simple REST API
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/users/login", "/api/users/signup").permitAll() // Allow login/signup
                .requestMatchers("/h2-console/**").permitAll() // Allow H2 console access
                .anyRequest().permitAll() // Allow all other requests for simplicity
            )
            .headers(headers -> headers.frameOptions(frame -> frame.disable())); // Allow H2 console to load in frames
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
