import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();
  const fallbackImage = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80';

  const handleImageError = (e) => {
    e.target.src = fallbackImage;
  };

  const handleClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <motion.div 
      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
      className="product-card" 
      style={{ 
        cursor: 'pointer', 
        transition: 'all 0.3s ease', 
        border: '1px solid #f0f0f0',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#fff'
      }} 
      onClick={handleClick}
    >
      <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: '#f9f9f9' }}>
        <motion.img 
          whileHover={{ scale: 1.1 }}
          src={product.image} 
          alt={product.name} 
          referrerPolicy="no-referrer" 
          onError={handleImageError}
          style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
        />
      </div>
      <div className="product-info" style={{ padding: '1rem' }}>
        <h3 style={{ fontSize: '1rem', height: '2.5rem', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', marginBottom: '0.2rem' }}>
          {product.name}
        </h3>
        <p style={{ color: '#878787', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{product.category}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ backgroundColor: '#388e3c', color: '#fff', padding: '1px 5px', borderRadius: '3px', fontSize: '0.8rem', fontWeight: 'bold' }}>
            {product.rating || 4.2} ★
          </span>
          <span style={{ color: '#878787', fontSize: '0.8rem' }}>({product.numReviews || 124})</span>
        </div>
        <p className="price" style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#212121' }}>₹{product.price.toLocaleString('en-IN')}</p>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => { e.stopPropagation(); onAddToCart(product._id); }} 
          className="btn-add"
          style={{ marginTop: '0.5rem', width: '100%', padding: '0.6rem', borderRadius: '4px' }}
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
