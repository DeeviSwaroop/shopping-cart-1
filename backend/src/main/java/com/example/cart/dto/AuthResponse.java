package com.example.cart.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String userId;
    private String name;
    private String email;
    private String message;
}
