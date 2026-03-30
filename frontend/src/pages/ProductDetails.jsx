import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, addToCart } from '../services/api';
import { CartContext } from '../context/CartContext';
import { motion } from 'motion/react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add items to cart');
      navigate('/login');
      return;
    }
    try {
      await addToCart(product._id, quantity);
      fetchCart();
      alert('Product added to cart!');
    } catch (err) {
      alert('Failed to add to cart');
    }
  };

  if (loading) return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid var(--primary)', borderRadius: '50%' }}
      />
    </div>
  );
  if (error) return <div className="error">{error}</div>;
  if (!product) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container" 
      style={{ padding: '2rem 0' }}
    >
      <motion.button 
        whileHover={{ x: -5 }}
        onClick={() => navigate(-1)} 
        style={{ marginBottom: '1rem', background: 'none', border: 'none', color: '#2874f0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}
      >
        ← Back to Results
      </motion.button>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          style={{ textAlign: 'center' }}
        >
          <motion.img 
            whileHover={{ scale: 1.05 }}
            src={product.image} 
            alt={product.name} 
            style={{ maxWidth: '100%', maxHeight: '500px', objectFit: 'contain' }}
            referrerPolicy="no-referrer"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop'; }}
          />
        </motion.div>
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.2rem' }}>{product.name}</h1>
          <p style={{ color: '#878787', fontSize: '1rem', marginBottom: '1rem' }}>Category: {product.category}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <span style={{ backgroundColor: '#388e3c', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}>
              {product.rating || 4.2} ★
            </span>
            <span style={{ color: '#878787', fontSize: '0.9rem' }}>({product.numReviews || 124} Ratings)</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            ₹{product.price.toLocaleString('en-IN')}
          </div>
          <div style={{ marginBottom: '1.5rem', color: product.stock > 0 ? '#388e3c' : '#d32f2f', fontWeight: 'bold' }}>
            {product.stock > 0 ? `In Stock (${product.stock} units left)` : 'Out of Stock'}
          </div>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Product Description</h3>
            <p style={{ color: '#212121', lineHeight: '1.6' }}>{product.description}</p>
          </div>
          
          {product.stock > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <label htmlFor="quantity">Quantity:</label>
              <select 
                id="quantity" 
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #dbdbdb' }}
              >
                {[...Array(Math.min(product.stock, 10)).keys()].map(x => (
                  <option key={x + 1} value={x + 1}>{x + 1}</option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary" 
              style={{ flex: 1, minWidth: '150px', padding: '1rem', fontSize: '1.1rem', backgroundColor: '#ff9f00', border: 'none' }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              ADD TO CART
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary" 
              style={{ flex: 1, minWidth: '150px', padding: '1rem', fontSize: '1.1rem', backgroundColor: '#fb641b', border: 'none' }}
              onClick={() => { handleAddToCart(); navigate('/cart'); }}
              disabled={product.stock === 0}
            >
              BUY NOW
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProductDetails;
