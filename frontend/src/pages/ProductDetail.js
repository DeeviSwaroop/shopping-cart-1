import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useInventory } from '../hooks/useInventory';
import api from '../services/api';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [feedback, setFeedback] = useState('');
  const [adding, setAdding] = useState(false);

  const inventory = useInventory(product ? [product.id] : []);
  const liveStock = product ? (inventory[product.id] ?? product.stockQuantity) : 0;
  const inStock = liveStock > 0;

  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    setAdding(true);
    setFeedback('');
    try {
      await addItem(product.id, qty);
      setFeedback('Added to cart!');
    } catch (err) {
      setFeedback(err.response?.data?.error ?? 'Error adding to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) return (
    <div className="flex-center" style={{ padding: 80 }}>
      <span className="spinner" style={{ width: 40, height: 40 }} />
    </div>
  );

  if (!product) return (
    <div className="container" style={{ padding: '48px 16px', textAlign: 'center' }}>
      <p>Product not found.</p>
      <Link to="/browse" className="btn btn-primary btn-sm mt-16">Back to Browse</Link>
    </div>
  );

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 48 }}>
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link> &rsaquo;{' '}
        <Link to={`/browse?category=${product.category}`}>{product.category}</Link> &rsaquo;{' '}
        <Link to={`/browse?category=${product.category}&subCategory=${product.subCategory}`}>
          {product.subCategory?.replace(/_/g, ' ')}
        </Link> &rsaquo;{' '}
        <span>{product.name}</span>
      </nav>

      <div className="product-detail">
        <div className="product-detail__img-col">
          <img
            src={product.imageUrl || `https://via.placeholder.com/500x350?text=${encodeURIComponent(product.name)}`}
            alt={product.name}
            className="product-detail__img"
          />
        </div>

        <div className="product-detail__info">
          <div className="flex gap-8" style={{ flexWrap: 'wrap', marginBottom: 8 }}>
            <span className="badge badge-info">{product.subCategory?.replace(/_/g, ' ')}</span>
            {product.classLevel && product.classLevel !== 'ALL' && (
              <span className="badge badge-warning">Class {product.classLevel}</span>
            )}
          </div>

          <h1 className="product-detail__title">{product.name}</h1>

          {product.author && (
            <p className="product-detail__author">
              by <strong>{product.author}</strong>
              {product.subject && ` · ${product.subject}`}
            </p>
          )}

          {product.description && (
            <p className="product-detail__desc">{product.description}</p>
          )}

          <div className="product-detail__price-row">
            <span className="product-detail__price">₹{product.price.toFixed(2)}</span>
            <span className={`badge ${inStock ? 'badge-success' : 'badge-danger'}`}>
              {inStock ? `${liveStock} in stock` : 'Out of stock'}
            </span>
          </div>

          {inStock && (
            <div className="product-detail__qty-row">
              <label htmlFor="qty">Qty:</label>
              <div className="qty-control">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(liveStock, q + 1))} disabled={qty >= liveStock}>+</button>
              </div>
            </div>
          )}

          {feedback && (
            <p className={feedback.includes('!') ? 'success-msg mt-8' : 'error-msg mt-8'}>{feedback}</p>
          )}

          <div className="flex gap-16 mt-16" style={{ flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={handleAddToCart}
              disabled={!inStock || adding}
            >
              {adding ? <span className="spinner" /> : '🛒 Add to Cart'}
            </button>
            {user && (
              <button
                className="btn btn-secondary btn-lg"
                onClick={async () => {
                  await handleAddToCart();
                  navigate('/cart');
                }}
                disabled={!inStock || adding}
              >
                Buy Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
