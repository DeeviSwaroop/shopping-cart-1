package com.example.cart.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    @Indexed
    private String userId;

    private List<CartItem> items;

    private double totalAmount;

    /**
     * PENDING, PAYMENT_INITIATED, PAID, FAILED, CANCELLED
     */
    private String status;

    /** Payment gateway transaction id */
    private String transactionId;

    private String paymentMethod;

    private Instant createdAt = Instant.now();

    private Instant updatedAt = Instant.now();
}
