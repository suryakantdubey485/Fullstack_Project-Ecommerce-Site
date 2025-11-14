import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { cart } = useContext(CartContext);
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">🛍️ ShopHop</Link>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/cart">
            Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/orders">Orders</Link>
              <Link to="/profile">Profile</Link>
              <button onClick={logout} style={{ padding: '8px 15px' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link>
              <Link to="/admin/login">Admin</Link>
            </>
          )}
          <button onClick={toggleTheme} className="theme-toggle" title="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
