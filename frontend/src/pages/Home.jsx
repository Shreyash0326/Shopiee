import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { getProducts, addToCart } from '../services/api';
import ProductCard from '../components/ProductCard';
import { CartContext } from '../context/CartContext';

import { motion } from 'motion/react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const { fetchCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
        setFilteredProducts(data);
        
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(data.map(p => p.category))];
        setCategories(uniqueCategories);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get('search');
    
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product => 
        (product.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (product.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [location.search, products, selectedCategory]);

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to add items to cart');
      return;
    }
    try {
      await addToCart(productId);
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

  return (
    <div className="container">
      <div 
        className="category-bar" 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-evenly',
          flexWrap: 'wrap',
          gap: '1rem', 
          padding: '1rem 0', 
          borderBottom: '1px solid #eee', 
          marginBottom: '1.5rem'
        }}
      >
        {categories.map(cat => (
          <button 
            key={cat} 
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '25px',
              border: '1px solid var(--primary)',
              backgroundColor: selectedCategory === cat ? 'var(--primary)' : '#fff',
              color: selectedCategory === cat ? '#fff' : 'var(--primary)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontWeight: '600',
              fontSize: '0.9rem',
              transition: 'background-color 0.2s, color 0.2s'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.div 
        layout
        className="product-grid"
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              key={product._id}
            >
              <ProductCard 
                product={product} 
                onAddToCart={handleAddToCart} 
              />
            </motion.div>
          ))
        ) : (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: 'center', gridColumn: '1/-1', padding: '3rem', color: '#666' }}
          >
            No products found matching your search.
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default Home;
