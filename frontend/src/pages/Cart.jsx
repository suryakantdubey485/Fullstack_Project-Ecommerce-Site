import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

function Cart() {
  const { cart, updateQuantity, removeFromCart, getTotal } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container">
        <div className="cart-page">
          <h1>Shopping Cart</h1>
          <p>Your cart is empty</p>
          <button onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="cart-page">
        <h1>Shopping Cart</h1>
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <img src={item.images[0]} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h3 className="cart-item-name">{item.name}</h3>
                <div className="cart-item-price">₹{item.price}</div>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <div style={{ marginTop: '10px' }}>
                  Subtotal: <strong>₹{item.price * item.quantity}</strong>
                </div>
              </div>
              <button className="danger" onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div>Total Items: {cart.reduce((sum, item) => sum + item.quantity, 0)}</div>
          <div className="cart-total">Total: ₹{getTotal()}</div>
          {isAuthenticated ? (
            <button onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
          ) : (
            <button onClick={() => navigate('/login', { state: { from: '/checkout' } })}>
              Login to Checkout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;
