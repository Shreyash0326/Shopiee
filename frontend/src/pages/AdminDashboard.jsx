import React, { useState, useEffect, useRef } from 'react';
import { getAllOrders, updateOrderStatus, getProducts, createProduct, updateProduct, deleteProduct, bulkCreateProducts, clearProducts } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';
import { Package, ShoppingBag, Plus, Trash2, Edit, FileJson, AlertTriangle, LayoutDashboard, ClipboardList } from 'lucide-react';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('orders');
  const fileInputRef = useRef(null);

  // Product Form State
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersData, productsData] = await Promise.all([
        getAllOrders(),
        getProducts(),
      ]);
      setOrders(ordersData);
      setProducts(productsData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, productData);
      } else {
        await createProduct(productData);
      }
      setShowProductForm(false);
      setEditingProduct(null);
      setProductData({ name: '', description: '', price: '', stock: '', category: '', image: '' });
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        fetchData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleClearCatalog = async () => {
    if (window.confirm('WARNING: This will delete ALL products from the database. Are you sure?')) {
      try {
        await clearProducts();
        fetchData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleBulkImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const productsData = JSON.parse(event.target.result);
        if (!Array.isArray(productsData)) {
          throw new Error('File must contain an array of products.');
        }
        await bulkCreateProducts(productsData);
        alert('Products imported successfully!');
        fetchData();
      } catch (err) {
        alert('Error importing products: ' + err.message);
      }
    };
    reader.readAsText(file);
    // Reset file input
    e.target.value = null;
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setProductData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category || '',
      image: product.image,
    });
    setShowProductForm(true);
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
  if (error) return <div className="container error-box">{error}</div>;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container"
      style={{ padding: '2rem 15px' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <LayoutDashboard size={28} color="var(--primary)" />
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Admin Dashboard</h1>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
        <button 
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : ''}`}
          onClick={() => setActiveTab('orders')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <ClipboardList size={18} /> Manage Orders
        </button>
        <button 
          className={`btn ${activeTab === 'products' ? 'btn-primary' : ''}`}
          onClick={() => setActiveTab('products')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Package size={18} /> Manage Products
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'orders' ? (
          <motion.div 
            key="orders"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="card"
          >
            <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ClipboardList size={24} color="var(--primary)" /> All Orders
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                    <th style={{ padding: '1rem' }}>Order ID</th>
                    <th style={{ padding: '1rem' }}>User</th>
                    <th style={{ padding: '1rem' }}>Total</th>
                    <th style={{ padding: '1rem' }}>Address</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '1rem', fontWeight: '500' }}>#{order._id.slice(-6).toUpperCase()}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: '500' }}>{order.user?.name}</div>
                        <div style={{ color: '#888', fontSize: '0.8rem' }}>{order.user?.email}</div>
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 'bold' }}>₹{order.totalAmount.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '1rem' }}>
                        {order.shippingAddress ? (
                          <div style={{ fontSize: '0.8rem', color: '#666' }}>
                            {order.shippingAddress.address}, {order.shippingAddress.city}<br />
                            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                          </div>
                        ) : 'N/A'}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`status ${(order.orderStatus || 'Processing').toLowerCase()}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <select 
                          value={order.orderStatus} 
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ddd' }}
                        >
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="products"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package size={24} color="var(--primary)" /> Product Catalog
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <input 
                  type="file" 
                  accept=".json" 
                  style={{ display: 'none' }} 
                  ref={fileInputRef} 
                  onChange={handleBulkImport} 
                />
                <button className="btn" onClick={() => fileInputRef.current.click()} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <FileJson size={16} /> Bulk Import
                </button>
                <button className="btn btn-primary" onClick={() => setShowProductForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Plus size={16} /> Add Product
                </button>
                <button className="btn" style={{ color: '#ff4d4d', borderColor: '#ff4d4d', display: 'flex', alignItems: 'center', gap: '0.4rem' }} onClick={handleClearCatalog}>
                  <AlertTriangle size={16} /> Clear All
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showProductForm && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="card" 
                  style={{ marginBottom: '2rem', overflow: 'hidden' }}
                >
                  <h3 style={{ marginBottom: '1.5rem' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                  <form onSubmit={handleProductSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div className="form-group">
                        <label>Product Name</label>
                        <input 
                          type="text" 
                          value={productData.name} 
                          onChange={(e) => setProductData({...productData, name: e.target.value})} 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label>Category</label>
                        <input 
                          type="text" 
                          value={productData.category} 
                          onChange={(e) => setProductData({...productData, category: e.target.value})} 
                          required 
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea 
                        rows="3"
                        value={productData.description} 
                        onChange={(e) => setProductData({...productData, description: e.target.value})} 
                        required 
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                      <div className="form-group">
                        <label>Price (₹)</label>
                        <input 
                          type="number" 
                          value={productData.price} 
                          onChange={(e) => setProductData({...productData, price: e.target.value})} 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label>Stock Quantity</label>
                        <input 
                          type="number" 
                          value={productData.stock} 
                          onChange={(e) => setProductData({...productData, stock: e.target.value})} 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label>Image URL</label>
                        <input 
                          type="text" 
                          value={productData.image} 
                          onChange={(e) => setProductData({...productData, image: e.target.value})} 
                          required 
                        />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <button type="submit" className="btn btn-primary">
                        {editingProduct ? 'Update Product' : 'Create Product'}
                      </button>
                      <button type="button" className="btn" onClick={() => { setShowProductForm(false); setEditingProduct(null); }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="card">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                      <th style={{ padding: '1rem' }}>Product</th>
                      <th style={{ padding: '1rem' }}>Category</th>
                      <th style={{ padding: '1rem' }}>Price</th>
                      <th style={{ padding: '1rem' }}>Stock</th>
                      <th style={{ padding: '1rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              referrerPolicy="no-referrer"
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'; }}
                              style={{ width: '40px', height: '40px', objectFit: 'contain', borderRadius: '4px', backgroundColor: '#f9f9f9' }} 
                            />
                            <span style={{ fontWeight: '500' }}>{product.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ backgroundColor: '#f0f0f0', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.8rem' }}>
                            {product.category}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', fontWeight: 'bold' }}>₹{product.price.toLocaleString('en-IN')}</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ color: product.stock < 10 ? '#ff4d4d' : 'inherit', fontWeight: product.stock < 10 ? 'bold' : 'normal' }}>
                            {product.stock}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn" style={{ padding: '0.4rem' }} onClick={() => openEditForm(product)} title="Edit">
                              <Edit size={16} />
                            </button>
                            <button className="btn" style={{ padding: '0.4rem', color: '#ff4d4d', borderColor: '#ff4d4d' }} onClick={() => handleDeleteProduct(product._id)} title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminDashboard;
