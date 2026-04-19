package com.example.cart.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
    private String productId;
    private String productName;
    private int quantity;
    private double unitPrice;

    public double getLineTotal() {
        return quantity * unitPrice;
    }
}
