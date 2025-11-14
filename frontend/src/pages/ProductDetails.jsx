import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [recommended, setRecommended] = useState([]);
  const [reviewForm, setReviewForm] = useState({ user: '', rating: 5, comment: '' });
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
    fetchRecommended();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/api/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const fetchRecommended = async () => {
    try {
      const res = await axios.get('/api/products');
      const current = res.data.find(p => p.id === parseInt(id));
      const related = res.data
        .filter(p => p.category === current?.category && p.id !== parseInt(id))
        .slice(0, 4);
      setRecommended(related);
    } catch (error) {
      console.error('Error fetching recommended:', error);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/reviews/${id}`, reviewForm);
      setReviewForm({ user: '', rating: 5, comment: '' });
      fetchProduct();
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  if (!product) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <div className="product-details">
        <div className="product-details-content">
          <div className="image-slider">
            <img src={product.images[currentImage]} alt={product.name} className="slider-image" />
            {product.images.length > 1 && (
              <>
                <button
                  className="slider-button prev"
                  onClick={() => setCurrentImage(prev => (prev - 1 + product.images.length) % product.images.length)}
                >
                  ←
                </button>
                <button
                  className="slider-button next"
                  onClick={() => setCurrentImage(prev => (prev + 1) % product.images.length)}
                >
                  →
                </button>
              </>
            )}
          </div>

          <div className="product-info">
            <h1>{product.name}</h1>
            <div className="product-category">{product.category}</div>
            <div className="product-price">₹{product.price}</div>
            <div className="product-rating">
              <span className="star">{renderStars(product.rating)}</span>
              <span>({product.rating})</span>
            </div>
            <p className="product-description">{product.description}</p>
            <div className={`product-stock ${product.stock === 0 ? 'out-of-stock' : ''}`}>
              {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
            </div>
            <div className="product-actions-detail">
              <button onClick={() => addToCart(product)} disabled={product.stock === 0}>
                Add to Cart
              </button>
              <button
                className="secondary"
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login', { state: { from: `/product/${id}` } });
                    return;
                  }
                  addToCart(product);
                  navigate('/checkout');
                }}
                disabled={product.stock === 0}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="reviews-section">
        <h2>Customer Reviews</h2>
        {product.reviews.map((review, idx) => (
          <div key={idx} className="review-item">
            <div className="review-header">
              <span className="review-user">{review.user}</span>
              <span className="review-date">{review.date}</span>
            </div>
            <div className="product-rating">
              <span className="star">{renderStars(review.rating)}</span>
            </div>
            <p className="review-comment">{review.comment}</p>
          </div>
        ))}

        <form onSubmit={handleAddReview} className="add-review-form">
          <h3>Add Your Review</h3>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={reviewForm.user}
              onChange={(e) => setReviewForm({ ...reviewForm, user: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Rating</label>
            <select
              value={reviewForm.rating}
              onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
            >
              {[5, 4, 3, 2, 1].map(r => (
                <option key={r} value={r}>{r} Stars</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Comment</label>
            <textarea
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              required
            />
          </div>
          <button type="submit">Submit Review</button>
        </form>
      </div>

      {recommended.length > 0 && (
        <div className="reviews-section">
          <h2>Recommended Products</h2>
          <div className="product-grid">
            {recommended.map(p => (
              <div key={p.id} className="product-card" onClick={() => navigate(`/product/${p.id}`)}>
                <img src={p.images[0]} alt={p.name} className="product-image" />
                <h3 className="product-name">{p.name}</h3>
                <div className="product-price">₹{p.price}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
