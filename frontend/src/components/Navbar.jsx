import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { motion } from 'motion/react';
import { Search, ShoppingCart, User, LogOut, LayoutDashboard, Home as HomeIcon } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${searchTerm}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/" className="logo" style={{ flexShrink: 0 }}>
          <motion.img 
            whileHover={{ scale: 1.05 }}
            src="/logo.png" 
            alt="Shopiee" 
            style={{ height: '40px', objectFit: 'contain' }}
            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
          />
          <span style={{ display: 'none', fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>Shopiee</span>
        </Link>
        
        <form onSubmit={handleSearch} style={{ flexGrow: 1, display: 'flex', maxWidth: '600px', minWidth: '200px', backgroundColor: '#fff', borderRadius: '4px', overflow: 'hidden' }}>
          <input
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.6rem 1rem',
              border: 'none',
              outline: 'none',
              fontSize: '0.9rem',
              color: '#333'
            }}
          />
          <button 
            type="submit" 
            style={{
              padding: '0 1rem',
              backgroundColor: 'var(--secondary)',
              border: 'none',
              cursor: 'pointer',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Search size={18} />
          </button>
        </form>

        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginLeft: 0 }}>
            <HomeIcon size={18} className="nav-icon" />
            <span className="nav-text">Home</span>
          </Link>
          
          {user ? (
            <>
              <Link to="/orders" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginLeft: 0 }}>
                <User size={18} className="nav-icon" />
                <span className="nav-text">Orders</span>
              </Link>
              
              <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', position: 'relative', marginLeft: 0 }}>
                <ShoppingCart size={18} className="nav-icon" />
                <span className="nav-text">Cart</span>
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{ 
                      position: 'absolute', 
                      top: '-8px', 
                      right: '-10px', 
                      backgroundColor: '#ff6161', 
                      color: '#fff', 
                      fontSize: '0.65rem', 
                      minWidth: '16px', 
                      height: '16px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      borderRadius: '50%', 
                      fontWeight: 'bold',
                      padding: '2px'
                    }}
                  >
                    {cartCount}
                  </motion.span>
                )}
              </Link>
              
              {user.role === 'admin' && (
                <Link to="/admin" style={{ color: '#ffe500', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.3rem', marginLeft: 0 }}>
                  <LayoutDashboard size={18} className="nav-icon" />
                  <span className="nav-text">Admin</span>
                </Link>
              )}
              
              <button onClick={handleLogout} className="btn-logout" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginLeft: 0 }}>
                <LogOut size={18} className="nav-icon" />
                <span className="nav-text">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ marginLeft: 0 }}>Login</Link>
              <Link to="/register" style={{ marginLeft: 0 }}>Register</Link>
            </>
          )}
        </div>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          .nav-text {
            display: none;
          }
          .navbar .container {
            justify-content: center;
          }
          .logo {
            order: 1;
          }
          .nav-links {
            order: 2;
          }
          form {
            order: 3;
            width: 100%;
            max-width: 100% !important;
            margin-top: 0.5rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
