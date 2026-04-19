import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './OrderHistory.css';

const STATUS_COLORS = {
  PENDING: 'badge-warning',
  PAYMENT_INITIATED: 'badge-info',
  PAID: 'badge-success',
  FAILED: 'badge-danger',
  CANCELLED: 'badge-danger',
};

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api
      .get('/orders/history')
      .then((res) => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex-center" style={{ padding: 80 }}>
      <span className="spinner" style={{ width: 40, height: 40 }} />
    </div>
  );

  if (orders.length === 0) return (
    <div className="container" style={{ paddingTop: 48, textAlign: 'center' }}>
      <span style={{ fontSize: 64 }}>📦</span>
      <h2 style={{ marginTop: 16 }}>No orders yet</h2>
      <p className="text-muted">Your order history will appear here once you place an order.</p>
      <Link to="/browse" className="btn btn-primary btn-lg mt-24">Start Shopping</Link>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      <h1 className="orders__title">📦 Order History</h1>

      <div className="orders__list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-card__header" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
              <div className="order-card__meta">
                <span className="order-card__id">#{order.id.slice(-8).toUpperCase()}</span>
                <span className={`badge ${STATUS_COLORS[order.status] ?? 'badge-info'}`}>
                  {order.status}
                </span>
              </div>
              <div className="order-card__meta">
                <span className="order-card__date">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </span>
                <span className="order-card__total">₹{order.totalAmount?.toFixed(2)}</span>
                <span className="order-card__toggle">{expanded === order.id ? '▲' : '▼'}</span>
              </div>
            </div>

            {expanded === order.id && (
              <div className="order-card__body">
                {order.transactionId && (
                  <p className="order-card__txn text-muted">Txn: {order.transactionId}</p>
                )}
                <table className="order-items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.productName}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.unitPrice?.toFixed(2)}</td>
                        <td>₹{(item.unitPrice * item.quantity)?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
