package com.example.cart.service;

import com.example.cart.model.Cart;
import com.example.cart.model.CartItem;
import com.example.cart.model.Product;
import com.example.cart.repository.CartRepository;
import com.example.cart.repository.ProductRepository;
import com.example.cart.websocket.InventoryEventPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final InventoryEventPublisher inventoryPublisher;

    public Cart getOrCreateCart(String userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUserId(userId);
                    return cartRepository.save(cart);
                });
    }

    public Cart addItem(String userId, String productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock. Available: " + product.getStockQuantity());
        }

        Cart cart = getOrCreateCart(userId);

        Optional<CartItem> existing = cart.getItems().stream()
                .filter(i -> i.getProductId().equals(productId))
                .findFirst();

        if (existing.isPresent()) {
            int newQty = existing.get().getQuantity() + quantity;
            if (newQty > product.getStockQuantity()) {
                throw new RuntimeException("Cannot add more. Stock available: " + product.getStockQuantity());
            }
            existing.get().setQuantity(newQty);
        } else {
            CartItem item = new CartItem(productId, product.getName(), quantity, product.getPrice());
            cart.getItems().add(item);
        }

        cart.setUpdatedAt(Instant.now());
        Cart saved = cartRepository.save(cart);

        // Broadcast inventory update to all subscribers
        inventoryPublisher.publishInventoryUpdate(productId, product.getStockQuantity());
        return saved;
    }

    public Cart removeItem(String userId, String productId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().removeIf(i -> i.getProductId().equals(productId));
        cart.setUpdatedAt(Instant.now());
        Cart saved = cartRepository.save(cart);

        productRepository.findById(productId).ifPresent(p ->
                inventoryPublisher.publishInventoryUpdate(productId, p.getStockQuantity()));
        return saved;
    }

    public Cart updateItemQuantity(String userId, String productId, int quantity) {
        if (quantity <= 0) return removeItem(userId, productId);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock. Available: " + product.getStockQuantity());
        }

        Cart cart = getOrCreateCart(userId);
        cart.getItems().stream()
                .filter(i -> i.getProductId().equals(productId))
                .findFirst()
                .ifPresent(i -> i.setQuantity(quantity));

        cart.setUpdatedAt(Instant.now());
        Cart saved = cartRepository.save(cart);
        inventoryPublisher.publishInventoryUpdate(productId, product.getStockQuantity());
        return saved;
    }

    public void clearCart(String userId) {
        cartRepository.findByUserId(userId).ifPresent(cart -> {
            cart.getItems().clear();
            cart.setUpdatedAt(Instant.now());
            cartRepository.save(cart);
        });
    }
}
