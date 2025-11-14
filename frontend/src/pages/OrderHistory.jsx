import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { user, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/orders' } });
      return;
    }
    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders');
      // Filter orders for current user
      const userOrders = res.data.filter(order => order.user === user?.name);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.put(`/api/orders/${orderId}`, { status: 'Cancelled' });
      fetchOrders();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  return (
    <div className="container">
      <h1>Order History</h1>
      
      {orders.length === 0 ? (
        <div className="checkout-page">
          <p>No orders yet</p>
        </div>
      ) : (
        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.order_id}>
                  <td>{order.order_id}</td>
                  <td>{order.date}</td>
                  <td>₹{order.total_amount}</td>
                  <td>{order.status}</td>
                  <td>
                    <button onClick={() => setSelectedOrder(order)}>View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedOrder && (
        <div className="checkout-page" style={{ marginTop: '30px' }}>
          <h2>Order Details - #{selectedOrder.order_id}</h2>
          <div className="checkout-summary">
            <div><strong>Customer:</strong> {selectedOrder.user}</div>
            <div><strong>Date:</strong> {selectedOrder.date}</div>
            <div><strong>Status:</strong> {selectedOrder.status}</div>
            <div><strong>Address:</strong> {selectedOrder.address}</div>
            <div><strong>Phone:</strong> {selectedOrder.phone}</div>
            <div><strong>Payment:</strong> {selectedOrder.paymentMethod}</div>
          </div>

          <h3>Items</h3>
          {selectedOrder.items.map((item, idx) => (
            <div key={idx} className="checkout-item">
              <span>{item.name} x {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div className="checkout-item" style={{ fontWeight: 'bold', fontSize: '18px' }}>
            <span>Total</span>
            <span>₹{selectedOrder.total_amount}</span>
          </div>

          {selectedOrder.status === 'Pending' && (
            <button
              className="danger"
              onClick={() => handleCancelOrder(selectedOrder.order_id)}
              style={{ marginTop: '20px' }}
            >
              Cancel Order
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
