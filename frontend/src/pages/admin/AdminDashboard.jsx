import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) {
      navigate('/admin/login');
      return;
    }
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/orders')
      ]);

      const revenue = ordersRes.data
        .filter(o => o.status !== 'Cancelled')
        .reduce((sum, o) => sum + o.total_amount, 0);

      const users = new Set(ordersRes.data.map(o => o.user)).size;

      setStats({
        totalProducts: productsRes.data.length,
        totalOrders: ordersRes.data.length,
        totalUsers: users,
        totalRevenue: revenue
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  return (
    <div className="admin-dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Admin Dashboard</h1>
        <button className="danger" onClick={handleLogout}>Logout</button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">{stats.totalProducts}</div>
          <div className="stat-label">Total Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalOrders}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalUsers}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">₹{stats.totalRevenue}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
        <Link to="/admin/products">
          <button>Manage Products</button>
        </Link>
        <Link to="/admin/orders">
          <button className="secondary">Manage Orders</button>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
