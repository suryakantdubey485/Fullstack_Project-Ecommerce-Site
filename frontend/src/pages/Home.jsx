import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

function Home() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('');
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterAndSort();
  }, [products, search, category, sortBy]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const filterAndSort = () => {
    let filtered = [...products];

    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== 'All') {
      filtered = filtered.filter(p => p.category === category);
    }

    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setFilteredProducts(filtered);
  };

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const renderStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  return (
    <>
      <div className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Discover Amazing Products</h1>
            <p className="hero-subtitle">Shop the latest trends with unbeatable prices</p>
          </div>
        </div>
      </div>
      <div className="container">
      <div className="search-filter-section">
        <input
          type="text"
          className="search-bar"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filters">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="product-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image-container" onClick={() => navigate(`/product/${product.id}`)}>
              <img
                src={product.images[0]}
                alt={product.name}
                className="product-image"
              />
              {product.stock < 10 && product.stock > 0 && (
                <span className="product-badge">Only {product.stock} left</span>
              )}
              {product.rating >= 4.5 && (
                <span className="product-badge">⭐ Top Rated</span>
              )}
            </div>
            <div className="product-card-content">
              <h3 className="product-name" onClick={() => navigate(`/product/${product.id}`)}>
                {product.name}
              </h3>
              <div className="product-price-row">
                <div className="product-price">₹{product.price.toLocaleString()}</div>
              </div>
              <div className="product-rating">
                <div className="rating-stars">
                  {renderStars(product.rating)}
                </div>
                <span className="rating-count">({product.rating})</span>
              </div>
              <div className="product-actions">
                <button className="btn-primary" onClick={() => addToCart(product)}>
                  Add to Cart
                </button>
                <button className="btn-secondary" onClick={() => navigate(`/product/${product.id}`)}>
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}

export default Home;
