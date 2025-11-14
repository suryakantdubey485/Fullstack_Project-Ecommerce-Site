import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/admin/login', form);
      if (res.data.success) {
        localStorage.setItem('adminAuth', 'true');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="admin-login">
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Admin Login</h1>
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
        <button type="submit" style={{ width: '100%' }}>Login</button>
      </form>
      <p style={{ marginTop: '20px', textAlign: 'center', color: '#666' }}>
        Default: admin / admin123
      </p>
    </div>
  );
}

export default AdminLogin;
