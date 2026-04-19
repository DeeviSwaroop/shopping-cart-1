import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import './Checkout.css';

const PAYMENT_METHODS = [
  { value: 'UPI', label: '💳 UPI / Google Pay / PhonePe' },
  { value: 'CARD', label: '🏦 Credit / Debit Card' },
  { value: 'NETBANKING', label: '🌐 Net Banking' },
  { value: 'COD', label: '💵 Cash on Delivery' },
];

export default function Checkout() {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [step, setStep] = useState('review'); // 'review' | 'processing' | 'done'
  const [orderResult, setOrderResult] = useState(null);
  const [error, setError] = useState('');
  // Snapshot cart items at the time checkout begins so the summary
  // stays visible on the confirmation screen even after cart is cleared.
  const [cartSnapshot] = useState(() => cart?.items ?? []);

  const items = cartSnapshot;
  const total = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setStep('processing');
    setError('');

    try {
      // 1. Create order from cart
      const orderRes = await api.post('/orders/place', { paymentMethod });
      const order = orderRes.data;

      // 2. Simulate payment gateway (in production, redirect to Razorpay/PayU)
      await new Promise((r) => setTimeout(r, 2000)); // simulate delay

      // 3. Confirm payment (simulate success)
      const txnId = 'TXN' + Date.now();
      const confirmRes = await api.post('/orders/payment/confirm', {
        orderId: order.id,
        transactionId: txnId,
        success: true,
      });

      // 4. Sync cart state from server (backend cleared it on PAID)
      await fetchCart();

      setOrderResult(confirmRes.data);
      setStep('done');
    } catch (err) {
      setError(err.response?.data?.error ?? 'Payment failed. Please try again.');
      setStep('review');
    }
  };

  if (step === 'processing') {
    return (
      <div className="checkout-processing flex-center">
        <div className="text-center">
          <span className="spinner" style={{ width: 56, height: 56, borderWidth: 5 }} />
          <p style={{ marginTop: 24, fontSize: 18, fontWeight: 600 }}>Processing your payment…</p>
          <p className="text-muted mt-8">Please don't close this window.</p>
        </div>
      </div>
    );
  }

  if (step === 'done' && orderResult) {
    const success = orderResult.status === 'PAID';
    return (
      <div className="container" style={{ paddingTop: 48, paddingBottom: 64 }}>
        <div className="confirmation-card">
          <div className={`confirmation-card__icon ${success ? 'success' : 'fail'}`}>
            {success ? '✅' : '❌'}
          </div>
          <h1 className={`confirmation-card__title ${success ? '' : 'fail'}`}>
            {success ? 'Order Confirmed!' : 'Payment Failed'}
          </h1>
          <p className="text-muted">
            {success
              ? `Your order #${orderResult.id.slice(-8).toUpperCase()} has been placed successfully.`
              : 'Your payment could not be processed. Please try again.'}
          </p>

          {success && (
            <div className="confirmation-card__details">
              <div className="conf-row">
                <span>Transaction ID</span>
                <span>{orderResult.transactionId}</span>
              </div>
              <div className="conf-row">
                <span>Amount Paid</span>
                <span>₹{orderResult.totalAmount?.toFixed(2)}</span>
              </div>
              <div className="conf-row">
                <span>Payment Method</span>
                <span>{orderResult.paymentMethod}</span>
              </div>
              <div className="conf-row">
                <span>Status</span>
                <span className="badge badge-success">PAID</span>
              </div>
            </div>
          )}

          <div className="flex gap-16 mt-24" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/orders')}>
              View Order History
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
            {!success && (
              <button className="btn btn-secondary btn-lg" onClick={() => setStep('review')}>
                Retry Payment
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <h1 className="checkout__title">Checkout</h1>

      <div className="checkout__layout">
        {/* Order summary */}
        <div className="checkout__items">
          <h2 className="checkout__section-title">Order Summary</h2>
          {items.map((item) => (
            <div key={item.productId} className="checkout-item">
              <span className="checkout-item__name">{item.productName}</span>
              <span className="checkout-item__qty">x{item.quantity}</span>
              <span className="checkout-item__price">₹{(item.unitPrice * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="checkout__total">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment method */}
        <div className="checkout__payment">
          <h2 className="checkout__section-title">Payment Method</h2>
          <div className="payment-methods">
            {PAYMENT_METHODS.map((pm) => (
              <label key={pm.value} className={`payment-option ${paymentMethod === pm.value ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value={pm.value}
                  checked={paymentMethod === pm.value}
                  onChange={() => setPaymentMethod(pm.value)}
                />
                {pm.label}
              </label>
            ))}
          </div>

          {error && <p className="error-msg mt-8">{error}</p>}

          <button
            className="btn btn-secondary btn-lg"
            style={{ width: '100%', marginTop: 20 }}
            onClick={handlePlaceOrder}
            disabled={items.length === 0}
          >
            Pay ₹{total.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}
