import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useInventory } from '../hooks/useInventory';
import './Cart.css';

export default function Cart() {
  const { cart, loading, updateItem, removeItem } = useCart();
  const navigate = useNavigate();

  const itemIds = cart?.items?.map((i) => i.productId) ?? [];
  const inventory = useInventory(itemIds);

  if (loading) return (
    <div className="flex-center" style={{ padding: 80 }}>
      <span className="spinner" style={{ width: 40, height: 40 }} />
    </div>
  );

  const items = cart?.items ?? [];
  const total = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);

  if (items.length === 0) {
    return (
      <div className="container cart-empty">
        <span style={{ fontSize: 64 }}>🛒</span>
        <h2>Your cart is empty</h2>
        <p>Add some books, stationery or toys to get started.</p>
        <Link to="/browse" className="btn btn-primary btn-lg mt-16">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <h1 className="cart__title">🛒 Shopping Cart</h1>

      <div className="cart__layout">
        <div className="cart__items">
          {items.map((item) => {
            const liveStock = inventory[item.productId] ?? 999;
            return (
              <CartRow
                key={item.productId}
                item={item}
                liveStock={liveStock}
                onUpdate={(qty) => updateItem(item.productId, qty)}
                onRemove={() => removeItem(item.productId)}
              />
            );
          })}
        </div>

        <div className="cart__summary">
          <h2 className="cart__summary-title">Order Summary</h2>
          <div className="cart__summary-row">
            <span>Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <div className="cart__summary-row">
            <span>Shipping</span>
            <span className="badge badge-success">Free</span>
          </div>
          <div className="cart__summary-total">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <button
            className="btn btn-secondary btn-lg"
            style={{ width: '100%', marginTop: 16 }}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </button>
          <Link to="/browse" className="btn btn-outline btn-sm" style={{ width: '100%', marginTop: 10 }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

function CartRow({ item, liveStock, onUpdate, onRemove }) {
  const stockWarning = liveStock < item.quantity;

  return (
    <div className="cart-row">
      <img
        src={`https://via.placeholder.com/80x80?text=${encodeURIComponent(item.productName.slice(0, 10))}`}
        alt={item.productName}
        className="cart-row__img"
      />
      <div className="cart-row__info">
        <p className="cart-row__name">{item.productName}</p>
        {stockWarning && (
          <p className="error-msg" style={{ fontSize: 12 }}>
            Only {liveStock} left in stock!
          </p>
        )}
        <div className="qty-control mt-8">
          <button onClick={() => onUpdate(item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
          <span>{item.quantity}</span>
          <button onClick={() => onUpdate(item.quantity + 1)} disabled={item.quantity >= liveStock}>+</button>
        </div>
      </div>
      <div className="cart-row__right">
        <span className="cart-row__price">₹{(item.unitPrice * item.quantity).toFixed(2)}</span>
        <button className="btn btn-danger btn-sm" onClick={onRemove}>Remove</button>
      </div>
    </div>
  );
}
