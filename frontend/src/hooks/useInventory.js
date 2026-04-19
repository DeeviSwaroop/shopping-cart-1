import { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

/**
 * Subscribes to real-time inventory updates for a set of product IDs.
 * Returns a map: { [productId]: availableQty }
 */
export function useInventory(productIds = []) {
  const [inventory, setInventory] = useState({});
  const clientRef = useRef(null);

  useEffect(() => {
    if (productIds.length === 0) return;

    const client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        productIds.forEach((id) => {
          client.subscribe(`/topic/inventory/${id}`, (msg) => {
            const data = JSON.parse(msg.body);
            setInventory((prev) => ({
              ...prev,
              [data.productId]: data.availableQty,
            }));
          });
        });
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
    // Only reconnect when the product list changes (join as a stable string)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productIds.join(',')]);

  return inventory;
}
