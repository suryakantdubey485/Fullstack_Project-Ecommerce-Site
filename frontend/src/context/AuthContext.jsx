import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem('token', res.data.token);
    return res.data;
  };

  const signup = async (name, email, password) => {
    const res = await axios.post('/api/auth/signup', { name, email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    localStorage.setItem('token', res.data.token);
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const addAddress = async (address) => {
    const res = await axios.post('/api/auth/address', address, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(res.data);
    return res.data;
  };

  const updateAddress = async (id, address) => {
    const res = await axios.put(`/api/auth/address/${id}`, address, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(res.data);
    return res.data;
  };

  const deleteAddress = async (id) => {
    const res = await axios.delete(`/api/auth/address/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUser(res.data);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      signup,
      logout,
      addAddress,
      updateAddress,
      deleteAddress,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
