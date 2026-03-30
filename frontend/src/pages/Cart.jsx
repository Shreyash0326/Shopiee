import React, { useState, useEffect, useContext } from 'react';
import { getCart, removeFromCart, placeOrder } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, ShoppingBag, MapPin, CreditCard, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const navigate = useNavigate();
  const { fetchCart: refreshCartCount } = useContext(CartContext);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const data = await getCart();
      setCart(data);
    } catch (err) {
      console.error('Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
      fetchCart();
      refreshCartCount();
    } catch (err) {
      alert('Failed to remove item');
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.items.length === 0 || placingOrder) return;
    
    if (!address || !city || !postalCode || !country) {
      alert('Please fill in all shipping address fields');
      return;
    }

    const totalAmount = cart.items.reduce(
      (acc, item) => acc + item.product.price * item.quantity, 
      0
    );

    const orderData = {
      products: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      })),
      totalAmount,
      shippingAddress: {
        address,
        city,
        postalCode,
        country
      }
    };

    setPlacingOrder(true);
    try {
      await placeOrder(orderData);
      refreshCartCount();
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      alert('Failed to place order');
    } finally {
      setPlacingOrder(false);
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

  const totalPrice = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity, 
    0
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container"
      style={{ padding: '2rem 15px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <ShoppingBag size={28} color="var(--primary)" />
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Your Shopping Cart</h1>
      </div>

      {cart.items.length === 0 ? (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: 'var(--shadow)' }}
        >
          <ShoppingBag size={64} color="#ccc" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{ marginBottom: '1rem', color: '#666' }}>Your cart is empty</h2>
          <p style={{ marginBottom: '2rem', color: '#888' }}>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={18} /> Continue Shopping
          </Link>
        </motion.div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            <AnimatePresence>
              {cart.items.map((item) => (
                <motion.div 
                  layout
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  key={item.product._id} 
                  className="cart-item"
                  style={{ position: 'relative' }}
                >
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    referrerPolicy="no-referrer" 
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'; }}
                    style={{ width: '100px', height: '100px', objectFit: 'contain', backgroundColor: '#f9f9f9', padding: '0.5rem' }}
                  />
                  <div className="item-details">
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{item.product.name}</h3>
                    <div style={{ display: 'flex', gap: '1.5rem', color: '#666', fontSize: '0.9rem' }}>
                      <span>Price: <strong>₹{item.product.price.toLocaleString('en-IN')}</strong></span>
                      <span>Qty: <strong>{item.quantity}</strong></span>
                    </div>
                    <div style={{ marginTop: '0.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                      Subtotal: ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1, color: '#ff0000' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemove(item.product._id)} 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: '0.5rem' }}
                    title="Remove item"
                  >
                    <Trash2 size={20} />
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="cart-summary"
            style={{ padding: '1.5rem', border: '1px solid #eee' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
              <MapPin size={20} color="var(--primary)" />
              <h3 style={{ margin: 0 }}>Shipping Details</h3>
            </div>
            
            <div className="form-group">
              <input type="text" placeholder="Street Address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="form-group">
                <input type="text" placeholder="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>

            <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: '#666' }}>
                <span>Subtotal ({cart.items.length} items)</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#666' }}>
                <span>Shipping</span>
                <span style={{ color: '#388e3c', fontWeight: 'bold' }}>FREE</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ddd', paddingTop: '1rem', fontSize: '1.3rem', fontWeight: 'bold' }}>
                <span>Total</span>
                <span style={{ color: 'var(--primary)' }}>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePlaceOrder} 
              disabled={placingOrder}
              className="btn-order"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.8rem', 
                padding: '1rem',
                opacity: placingOrder ? 0.7 : 1,
                cursor: placingOrder ? 'not-allowed' : 'pointer'
              }}
            >
              {placingOrder ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{ width: '20px', height: '20px', border: '2px solid #fff', borderTop: '2px solid transparent', borderRadius: '50%' }}
                />
              ) : (
                <><CreditCard size={20} /> Place Order</>
              )}
            </motion.button>
            
            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#999', marginTop: '1rem' }}>
              By placing your order, you agree to Shopiee's terms and conditions.
            </p>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Cart;
