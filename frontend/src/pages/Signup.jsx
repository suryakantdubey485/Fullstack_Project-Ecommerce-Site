import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await signup(form.name, form.email, form.password);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="admin-login">
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Create Account</h1>
      {error && <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
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
            minLength="6"
          />
        </div>
        <button type="submit" style={{ width: '100%' }}>Sign Up</button>
      </form>
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Already have an account? <Link to="/login" style={{ color: '#2B6CB0' }}>Login</Link>
      </p>
    </div>
  );
}

export default Signup;
