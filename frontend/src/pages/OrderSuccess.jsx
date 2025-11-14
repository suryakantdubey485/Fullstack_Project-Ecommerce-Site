import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="container">
        <div className="checkout-page">
          <h1>No order found</h1>
          <button onClick={() => navigate('/')}>Go Home</button>
        </div>
      </div>
    );
  }

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  return (
    <div className="container">
      <div className="checkout-page" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>✓</div>
        <h1 style={{ marginBottom: '20px' }}>Order Placed Successfully!</h1>
        <p style={{ fontSize: '18px', marginBottom: '30px', color: 'var(--text-secondary)' }}>
          Thank you for your purchase! Your order has been placed successfully.
        </p>
        
        <div className="checkout-summary" style={{ textAlign: 'left' }}>
          <div><strong>Order ID:</strong> {order.order_id}</div>
          <div><strong>Total Amount:</strong> ₹{order.total_amount.toLocaleString()}</div>
          <div><strong>Estimated Delivery:</strong> {estimatedDelivery.toLocaleDateString()}</div>
          <div><strong>Status:</strong> <span className="badge badge-success">{order.status}</span></div>
        </div>

        <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => navigate('/orders')}>View My Orders</button>
          <button className="btn-secondary" onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
