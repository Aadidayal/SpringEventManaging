package com.example.demo.util;

import java.util.regex.Pattern;

public class ValidationUtil {
    
    private static final Pattern EMAIL_PATTERN = 
        Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    
    public static boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }
    
    public static boolean isValidPassword(String password) {
        return password != null && password.length() >= 6;
    }
    
    public static String validateSignupData(String email, String password, String username) {
        if (username == null || username.trim().isEmpty()) {
            return "Username is required";
        }
        if (!isValidEmail(email)) {
            return "Please enter a valid email address";
        }
        if (!isValidPassword(password)) {
            return "Password must be at least 6 characters long";
        }
        return null; // No validation errors
    }
}