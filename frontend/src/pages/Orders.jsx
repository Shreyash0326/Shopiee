import React, { useState, useEffect } from 'react';
import { getOrders } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Clock, CheckCircle, Truck, XCircle, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();

    // Poll for status updates every 5 seconds
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return <Clock size={16} />;
      case 'processing': return <Package size={16} />;
      case 'shipped': return <Truck size={16} />;
      case 'delivered':
      case 'completed': return <CheckCircle size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      default: return <Clock size={16} />;
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container"
      style={{ padding: '2rem 15px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Package size={28} color="var(--primary)" />
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Your Orders</h1>
      </div>

      {orders.length === 0 ? (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: 'var(--shadow)' }}
        >
          <ShoppingBag size={64} color="#ccc" style={{ marginBottom: '1.5rem' }} />
          <h2 style={{ marginBottom: '1rem', color: '#666' }}>No orders yet</h2>
          <p style={{ marginBottom: '2rem', color: '#888' }}>You haven't placed any orders yet. Start shopping to see your orders here!</p>
          <Link to="/" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <ArrowLeft size={18} /> Start Shopping
          </Link>
        </motion.div>
      ) : (
        <div className="orders-list">
          <AnimatePresence>
            {orders.map((order, index) => (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                key={order._id} 
                className="order-card"
                style={{ border: '1px solid #eee', overflow: 'hidden' }}
              >
                <div className="order-header" style={{ backgroundColor: '#f9f9f9', padding: '1rem', margin: '-1.2rem -1.2rem 1.2rem -1.2rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#888' }}>ORDER ID</span>
                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>#{order._id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`status ${(order.orderStatus || 'Processing').toLowerCase()}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {getStatusIcon(order.orderStatus)}
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
                
                <div className="order-products" style={{ padding: '0.5rem 0' }}>
                  {order.products.map((item, idx) => (
                    <div key={idx} className="order-product" style={{ padding: '0.5rem 0', borderBottom: idx === order.products.length - 1 ? 'none' : '1px dashed #eee' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', backgroundColor: '#f0f0f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Package size={20} color="#999" />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontWeight: '500' }}>{item.product?.name || 'Product Removed'}</span>
                          <span style={{ fontSize: '0.8rem', color: '#888' }}>Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <span style={{ fontWeight: '600' }}>₹{(item.product?.price * item.quantity || 0).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer" style={{ borderTop: '1px solid #eee', marginTop: '1rem', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#888' }}>ORDER PLACED</span>
                    <span style={{ fontSize: '0.9rem' }}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.2rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#888' }}>TOTAL AMOUNT</span>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--primary)' }}>₹{order.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default Orders;
