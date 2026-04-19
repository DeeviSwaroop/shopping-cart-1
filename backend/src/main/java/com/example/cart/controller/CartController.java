package com.example.cart.controller;

import com.example.cart.dto.CartRequest;
import com.example.cart.model.Cart;
import com.example.cart.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<Cart> getCart(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(cartService.getOrCreateCart(user.getUsername()));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addItem(@AuthenticationPrincipal UserDetails user,
                                     @Valid @RequestBody CartRequest req) {
        try {
            Cart cart = cartService.addItem(user.getUsername(), req.getProductId(), req.getQuantity());
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateItem(@AuthenticationPrincipal UserDetails user,
                                        @Valid @RequestBody CartRequest req) {
        try {
            Cart cart = cartService.updateItemQuantity(user.getUsername(), req.getProductId(), req.getQuantity());
            return ResponseEntity.ok(cart);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Cart> removeItem(@AuthenticationPrincipal UserDetails user,
                                           @PathVariable String productId) {
        return ResponseEntity.ok(cartService.removeItem(user.getUsername(), productId));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(@AuthenticationPrincipal UserDetails user) {
        cartService.clearCart(user.getUsername());
        return ResponseEntity.ok(Map.of("message", "Cart cleared"));
    }
}
