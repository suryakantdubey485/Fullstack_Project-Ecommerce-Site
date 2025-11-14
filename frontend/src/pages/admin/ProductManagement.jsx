import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: '', price: '', category: '', description: '', stock: '', images: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminAuth')) {
      navigate('/admin/login');
      return;
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        images: form.images.split(',').map(s => s.trim()),
        rating: 0,
        reviews: []
      };

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct.id}`, data);
      } else {
        await axios.post('/api/products', data);
      }

      setShowForm(false);
      setEditingProduct(null);
      setForm({ name: '', price: '', category: '', description: '', stock: '', images: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      stock: product.stock,
      images: product.images.join(', ')
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await axios.delete(`/api/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Product Management</h1>
        <div>
          <button onClick={() => navigate('/admin/dashboard')} style={{ marginRight: '10px' }}>
            Back to Dashboard
          </button>
          <button className="secondary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Product'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="checkout-page" style={{ marginBottom: '30px' }}>
          <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Price (₹)</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Category</label>
              <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Image URLs (comma separated)</label>
              <input type="text" value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} required />
            </div>
            <button type="submit">{editingProduct ? 'Update' : 'Add'} Product</button>
          </form>
        </div>
      )}

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>₹{product.price}</td>
                <td>{product.stock}</td>
                <td>{product.rating}</td>
                <td>
                  <button onClick={() => handleEdit(product)} style={{ marginRight: '10px' }}>Edit</button>
                  <button className="danger" onClick={() => handleDelete(product.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductManagement;
