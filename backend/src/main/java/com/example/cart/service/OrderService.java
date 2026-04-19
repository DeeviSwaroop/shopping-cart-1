package com.example.cart.service;

import com.example.cart.model.Cart;
import com.example.cart.model.CartItem;
import com.example.cart.model.Order;
import com.example.cart.model.Product;
import com.example.cart.repository.OrderRepository;
import com.example.cart.repository.ProductRepository;
import com.example.cart.websocket.InventoryEventPublisher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;
    private final InventoryEventPublisher inventoryPublisher;

    public Order createOrderFromCart(String userId, String paymentMethod) {
        Cart cart = cartService.getOrCreateCart(userId);
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Re-validate stock before placing order
        for (CartItem item : cart.getItems()) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductId()));
            if (product.getStockQuantity() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for: " + product.getName()
                        + ". Available: " + product.getStockQuantity());
            }
        }

        Order order = new Order();
        order.setUserId(userId);
        order.setItems(List.copyOf(cart.getItems()));
        order.setTotalAmount(cart.getTotal());
        order.setStatus("PENDING");
        order.setPaymentMethod(paymentMethod);
        order.setCreatedAt(Instant.now());
        order.setUpdatedAt(Instant.now());

        return orderRepository.save(order);
    }

    public Order confirmPayment(String orderId, String userId, String transactionId, boolean success) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized order access");
        }

        order.setTransactionId(transactionId);
        order.setUpdatedAt(Instant.now());

        if (success) {
            order.setStatus("PAID");
            // Deduct stock and broadcast updated inventory via WebSocket
            for (CartItem item : order.getItems()) {
                productRepository.findById(item.getProductId()).ifPresent(p -> {
                    p.setStockQuantity(p.getStockQuantity() - item.getQuantity());
                    if (p.getStockQuantity() <= 0) {
                        p.setStockQuantity(0);
                        p.setAvailable(false);
                    }
                    Product saved = productRepository.save(p);
                    // Notify all WebSocket subscribers of new stock count
                    inventoryPublisher.publishInventoryUpdate(saved.getId(), saved.getStockQuantity());
                });
            }
            // Clear cart on server
            cartService.clearCart(userId);
        } else {
            order.setStatus("FAILED");
        }

        return orderRepository.save(order);
    }

    public List<Order> getOrderHistory(String userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Order getOrderById(String orderId, String userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (!order.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        return order;
    }
}
