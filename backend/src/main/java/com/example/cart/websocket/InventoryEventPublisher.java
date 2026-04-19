package com.example.cart.websocket;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class InventoryEventPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Broadcast inventory change to all subscribers of /topic/inventory/{productId}
     */
    public void publishInventoryUpdate(String productId, int availableQty) {
        messagingTemplate.convertAndSend(
                "/topic/inventory/" + productId,
                Map.of("productId", productId, "availableQty", availableQty)
        );
    }
}
