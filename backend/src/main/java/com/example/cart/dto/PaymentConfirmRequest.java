package com.example.cart.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PaymentConfirmRequest {

    @NotBlank
    private String orderId;

    private String transactionId;

    private boolean success;
}
