import PropTypes from 'prop-types';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

export function ProductCard({ product, liveStock }) {
  const { user } = useAuth();
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const [feedback, setFeedback] = useState('');

  const stockQty = liveStock !== undefined ? liveStock : product.stockQuantity;
  const inStock = stockQty > 0;

  const handleAddToCart = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setAdding(true);
    setFeedback('');
    try {
      await addItem(product.id, 1);
      setFeedback('Added!');
      setTimeout(() => setFeedback(''), 2000);
    } catch (err) {
      setFeedback(err.response?.data?.error ?? 'Error adding item');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-card__img-link">
        <img
          src={product.imageUrl || `https://via.placeholder.com/300x180?text=${encodeURIComponent(product.name)}`}
          alt={product.name}
          className="product-card__img"
          loading="lazy"
        />
      </Link>

      <div className="product-card__body">
        <div className="product-card__meta">
          <span className="badge badge-info">{product.subCategory?.replace(/_/g, ' ')}</span>
          {product.classLevel && product.classLevel !== 'ALL' && (
            <span className="badge badge-warning">Class {product.classLevel}</span>
          )}
        </div>

        <Link to={`/products/${product.id}`} className="product-card__name">
          {product.name}
        </Link>

        {product.author && (
          <p className="product-card__author">by {product.author}</p>
        )}

        <div className="product-card__footer">
          <span className="product-card__price">₹{product.price.toFixed(2)}</span>
          <span className={`badge ${inStock ? 'badge-success' : 'badge-danger'}`}>
            {inStock ? `${stockQty} in stock` : 'Out of stock'}
          </span>
        </div>

        {feedback && (
          <p className={feedback === 'Added!' ? 'success-msg mt-8' : 'error-msg mt-8'}>
            {feedback}
          </p>
        )}

        <button
          className="btn btn-primary btn-sm product-card__btn mt-8"
          onClick={handleAddToCart}
          disabled={!inStock || adding}
        >
          {adding ? <span className="spinner" /> : inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    stockQuantity: PropTypes.number.isRequired,
    subCategory: PropTypes.string,
    classLevel: PropTypes.string,
    author: PropTypes.string,
    imageUrl: PropTypes.string,
  }).isRequired,
  liveStock: PropTypes.number,
};
