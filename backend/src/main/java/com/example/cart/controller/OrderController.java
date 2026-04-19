package com.example.cart.controller;

import com.example.cart.dto.PaymentConfirmRequest;
import com.example.cart.model.Order;
import com.example.cart.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /**
     * Place an order from the user's current cart.
     * Body: { "paymentMethod": "RAZORPAY" }
     */
    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@AuthenticationPrincipal UserDetails user,
                                        @RequestBody Map<String, String> body) {
        try {
            String paymentMethod = body.getOrDefault("paymentMethod", "ONLINE");
            Order order = orderService.createOrderFromCart(user.getUsername(), paymentMethod);
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Receive payment gateway callback: success or failure.
     */
    @PostMapping("/payment/confirm")
    public ResponseEntity<?> confirmPayment(@AuthenticationPrincipal UserDetails user,
                                            @Valid @RequestBody PaymentConfirmRequest req) {
        try {
            Order order = orderService.confirmPayment(
                    req.getOrderId(), user.getUsername(),
                    req.getTransactionId(), req.isSuccess());
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Order history for the authenticated user.
     */
    @GetMapping("/history")
    public ResponseEntity<List<Order>> getHistory(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(orderService.getOrderHistory(user.getUsername()));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrder(@AuthenticationPrincipal UserDetails user,
                                      @PathVariable String orderId) {
        try {
            return ResponseEntity.ok(orderService.getOrderById(orderId, user.getUsername()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
