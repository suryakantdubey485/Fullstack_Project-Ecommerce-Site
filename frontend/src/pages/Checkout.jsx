import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

function Checkout() {
  const { cart, getTotal, clearCart } = useContext(CartContext);
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [form, setForm] = useState({
    address: '',
    phone: '',
    paymentMethod: 'COD'
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    // Set default address if available
    const defaultAddr = user?.addresses?.find(addr => addr.isDefault);
    if (defaultAddr) {
      setSelectedAddress(defaultAddr);
    }
  }, [isAuthenticated, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let addressToUse, phoneToUse;
    
    if (useNewAddress) {
      if (!form.address || !form.phone) {
        alert('Please fill in address and phone number');
        return;
      }
      addressToUse = form.address;
      phoneToUse = form.phone;
    } else {
      if (!selectedAddress) {
        alert('Please select a delivery address');
        return;
      }
      addressToUse = selectedAddress.fullAddress;
      phoneToUse = selectedAddress.phone;
    }

    try {
      const orderData = {
        user: user.name,
        items: cart.map(item => ({
          product_id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total_amount: getTotal(),
        address: addressToUse,
        phone: phoneToUse,
        paymentMethod: form.paymentMethod
      };

      const res = await axios.post('/api/orders', orderData);
      clearCart();
      navigate('/order-success', { state: { order: res.data } });
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container">
        <div className="checkout-page">
          <h1>Checkout</h1>
          <p>Your cart is empty</p>
          <button onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  if (!user) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="checkout-page">
        <h1>Checkout</h1>
        
        <div className="checkout-summary">
          <h2>Order Summary</h2>
          {cart.map(item => (
            <div key={item.id} className="checkout-item">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="checkout-item" style={{ fontWeight: 'bold', fontSize: '18px', marginTop: '10px' }}>
            <span>Total</span>
            <span>₹{getTotal()}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <h2>Delivery Address</h2>
          
          {user.addresses && user.addresses.length > 0 && (
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={!useNewAddress}
                  onChange={(e) => setUseNewAddress(!e.target.checked)}
                  style={{ width: 'auto' }}
                />
                Use saved address
              </label>
            </div>
          )}

          {!useNewAddress && user.addresses && user.addresses.length > 0 ? (
            <div className="form-group">
              <label>Select Address</label>
              {user.addresses.map(addr => (
                <div
                  key={addr._id}
                  onClick={() => setSelectedAddress(addr)}
                  className={`address-select-card ${selectedAddress?._id === addr._id ? 'selected' : ''}`}
                >
                  <strong>{addr.label}</strong>
                  {addr.isDefault && <span className="default-badge" style={{ marginLeft: '10px' }}>Default</span>}
                  <div style={{ marginTop: '5px' }}>{addr.fullAddress}</div>
                  <div style={{ marginTop: '5px' }}>Phone: {addr.phone}</div>
                </div>
              ))}
              <button
                type="button"
                className="secondary"
                onClick={() => setUseNewAddress(true)}
                style={{ marginTop: '10px' }}
              >
                Use Different Address
              </button>
            </div>
          ) : (
            <>
              <div className="form-group">
                <label>Delivery Address</label>
                <textarea
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  required={useNewAddress}
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required={useNewAddress}
                />
              </div>
              {user.addresses && user.addresses.length > 0 && (
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setUseNewAddress(false)}
                  style={{ marginBottom: '15px' }}
                >
                  Use Saved Address
                </button>
              )}
            </>
          )}

          <div className="form-group">
            <label>Payment Method</label>
            <select
              value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
            >
              <option value="COD">Cash on Delivery</option>
              <option value="UPI">UPI (Simulated)</option>
            </select>
          </div>
          
          <button type="submit">Place Order</button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
