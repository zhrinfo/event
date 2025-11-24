package com.example.eventapp.dto;

public class AuthResponse {
    
    private Long userId;
    private String token;
    private String email;
    private String role;  // ou List<String> roles si un utilisateur peut avoir plusieurs rôles

    // Constructeur
    public AuthResponse(Long userId, String token, String email, String role) {
        this.userId = userId;
        this.token = token;
        this.email = email;
        this.role = role;
    }

    // Getters et Setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}