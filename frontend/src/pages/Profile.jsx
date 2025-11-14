import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Profile() {
  const { user, isAuthenticated, addAddress, updateAddress, deleteAddress } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [form, setForm] = useState({ label: '', fullAddress: '', phone: '', isDefault: false });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await updateAddress(editingAddress._id, form);
      } else {
        await addAddress(form);
      }
      setShowForm(false);
      setEditingAddress(null);
      setForm({ label: '', fullAddress: '', phone: '', isDefault: false });
    } catch (error) {
      console.error('Error saving address:', error);
      alert('Failed to save address');
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setForm({
      label: address.label,
      fullAddress: address.fullAddress,
      phone: address.phone,
      isDefault: address.isDefault
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this address?')) return;
    try {
      await deleteAddress(id);
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  if (!user) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="profile-page">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-info">
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">{user.addresses?.length || 0}</span>
                <span className="stat-label">Addresses</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Orders</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">₹0</span>
                <span className="stat-label">Spent</span>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-tabs">
          <button 
            className={activeTab === 'overview' ? 'tab-active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button 
            className={activeTab === 'addresses' ? 'tab-active' : ''}
            onClick={() => setActiveTab('addresses')}
          >
            📍 Addresses
          </button>
          <button 
            className={activeTab === 'security' ? 'tab-active' : ''}
            onClick={() => setActiveTab('security')}
          >
            🔒 Security
          </button>
          <button 
            className={activeTab === 'preferences' ? 'tab-active' : ''}
            onClick={() => setActiveTab('preferences')}
          >
            ⚙️ Preferences
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'overview' && (
            <div className="tab-content">
              <div className="info-card">
                <h3>Account Information</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Full Name</label>
                    <p>{user.name}</p>
                  </div>
                  <div className="info-item">
                    <label>Email Address</label>
                    <p>{user.email}</p>
                  </div>
                  <div className="info-item">
                    <label>Member Since</label>
                    <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="info-item">
                    <label>Account Status</label>
                    <p><span className="status-badge">✓ Active</span></p>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <h3>Quick Actions</h3>
                <div className="quick-actions">
                  <button onClick={() => navigate('/orders')}>
                    📦 View Orders
                  </button>
                  <button onClick={() => setActiveTab('addresses')}>
                    📍 Manage Addresses
                  </button>
                  <button onClick={() => navigate('/cart')}>
                    🛒 Go to Cart
                  </button>
                  <button onClick={() => navigate('/')}>
                    🏠 Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="tab-content">
              <div className="section-header">
                <h3>Saved Addresses</h3>
                <button className="secondary" onClick={() => setShowForm(!showForm)}>
                  {showForm ? '✕ Cancel' : '+ Add Address'}
                </button>
              </div>

              {showForm && (
                <div className="address-form">
                  <h4>{editingAddress ? 'Edit Address' : 'Add New Address'}</h4>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Label</label>
                      <input
                        type="text"
                        placeholder="e.g., Home, Office, etc."
                        value={form.label}
                        onChange={(e) => setForm({ ...form, label: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Full Address</label>
                      <textarea
                        placeholder="Enter complete address"
                        value={form.fullAddress}
                        onChange={(e) => setForm({ ...form, fullAddress: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={form.isDefault}
                          onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                        />
                        Set as default address
                      </label>
                    </div>
                    <button type="submit">{editingAddress ? 'Update' : 'Add'} Address</button>
                  </form>
                </div>
              )}

              <div className="addresses-grid">
                {user.addresses && user.addresses.length === 0 ? (
                  <div className="empty-state">
                    <p>📍 No saved addresses yet</p>
                    <button onClick={() => setShowForm(true)}>Add Your First Address</button>
                  </div>
                ) : (
                  user.addresses?.map(address => (
                    <div key={address._id} className="address-card">
                      <div className="address-header">
                        <h4>{address.label}</h4>
                        {address.isDefault && <span className="default-badge">Default</span>}
                      </div>
                      <p className="address-text">{address.fullAddress}</p>
                      <p className="address-phone">📞 {address.phone}</p>
                      <div className="address-actions">
                        <button onClick={() => handleEdit(address)}>✏️ Edit</button>
                        <button className="danger" onClick={() => handleDelete(address._id)}>🗑️ Delete</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="tab-content">
              <div className="info-card">
                <h3>Security Settings</h3>
                <div className="security-options">
                  <div className="security-item">
                    <div>
                      <h4>Password</h4>
                      <p>Last changed: Never</p>
                    </div>
                    <button>Change Password</button>
                  </div>
                  <div className="security-item">
                    <div>
                      <h4>Two-Factor Authentication</h4>
                      <p>Add an extra layer of security</p>
                    </div>
                    <button className="secondary">Enable 2FA</button>
                  </div>
                  <div className="security-item">
                    <div>
                      <h4>Login History</h4>
                      <p>View your recent login activity</p>
                    </div>
                    <button>View History</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="tab-content">
              <div className="info-card">
                <h3>Preferences</h3>
                <div className="preferences-list">
                  <div className="preference-item">
                    <div>
                      <h4>Email Notifications</h4>
                      <p>Receive updates about your orders</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="preference-item">
                    <div>
                      <h4>Marketing Emails</h4>
                      <p>Get deals and promotional offers</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="preference-item">
                    <div>
                      <h4>SMS Notifications</h4>
                      <p>Order updates via text message</p>
                    </div>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
