import { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, cart: action.payload, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, { cart: null, loading: false, error: null });

  const fetchCart = useCallback(async () => {
    if (!user) return;
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await api.get('/cart');
      dispatch({ type: 'SET_CART', payload: res.data });
    } catch {
      dispatch({ type: 'SET_CART', payload: null });
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchCart();
    else dispatch({ type: 'SET_CART', payload: null });
  }, [user, fetchCart]);

  const addItem = useCallback(async (productId, quantity = 1) => {
    const res = await api.post('/cart/add', { productId, quantity });
    dispatch({ type: 'SET_CART', payload: res.data });
    return res.data;
  }, []);

  const updateItem = useCallback(async (productId, quantity) => {
    const res = await api.put('/cart/update', { productId, quantity });
    dispatch({ type: 'SET_CART', payload: res.data });
    return res.data;
  }, []);

  const removeItem = useCallback(async (productId) => {
    const res = await api.delete(`/cart/remove/${productId}`);
    dispatch({ type: 'SET_CART', payload: res.data });
    return res.data;
  }, []);

  const clearCart = useCallback(async () => {
    // Optimistically clear local state first so badge resets immediately
    dispatch({ type: 'SET_CART', payload: { items: [], total: 0 } });
    await api.delete('/cart/clear');
  }, []);

  const itemCount = state.cart?.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  return (
    <CartContext.Provider
      value={{
        ...state,
        itemCount,
        fetchCart,
        addItem,
        updateItem,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
