import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

export function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand">
          📚 StudyShop
        </Link>

        <div className="navbar__search">
          <SearchBar />
        </div>

        <div className="navbar__actions">
          {user ? (
            <>
              <Link to="/cart" className="navbar__cart-btn">
                🛒 Cart {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
              </Link>
              <Link to="/orders" className="navbar__link">Orders</Link>
              <span className="navbar__greeting">Hi, {user.name?.split(' ')[0]}</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Category nav bar */}
      <div className="category-nav">
        <div className="container category-nav__inner">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.value}
              to={`/browse?category=${cat.value}`}
              className="category-nav__item"
            >
              {cat.emoji} {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

function SearchBar() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = e.target.q.value.trim();
    if (q) navigate(`/browse?search=${encodeURIComponent(q)}`);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        name="q"
        type="search"
        placeholder="Search books, pens, toys..."
        className="search-bar__input"
        maxLength={100}
      />
      <button type="submit" className="search-bar__btn">🔍</button>
    </form>
  );
}

const CATEGORIES = [
  { value: 'BOOKS', label: 'Books', emoji: '📖' },
  { value: 'STATIONERY', label: 'Stationery', emoji: '✏️' },
  { value: 'TOYS', label: 'Toys', emoji: '🎮' },
];

Navbar.propTypes = {};
