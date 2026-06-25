import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useScrollHeader } from '@/hooks/useScrollHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import './Header.scss';

const Header = () => {
  const isScrolled = useScrollHeader(50);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container header__content">
        <Link to="/" className="header__logo" style={{ textDecoration: 'none' }}>XT<span>PC</span></Link>
        <nav className="header__nav">
          <Link to="/">Trang chủ</Link>
          <Link to="/build-pc" state={{ openQuiz: true }}>Build PC</Link>
          <Link to="/pc-lab">PC Lab 3D</Link>
          <Link to="/linh-kien-pc">Linh kiện</Link>
          <Link to="/gaming">Gaming PC</Link>
          <Link to="/lien-he">Liên hệ</Link>
        </nav>
        <div className="header__actions" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div 
            className="cart-icon-wrapper" 
            onClick={() => navigate('/cart')}
            style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', fontSize: '1.2rem', padding: '0 10px' }}
          >
            🛒
            {totalItems > 0 && (
              <span style={{
                position: 'absolute', top: '-8px', right: '0', background: '#ef4444', color: 'white',
                fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold'
              }}>
                {totalItems}
              </span>
            )}
          </div>
          {user ? (
            <>
              <button className="btn-login" onClick={() => navigate('/profile')}>{user.username || 'Profile'}</button>
              <button className="btn-register" onClick={() => { logout(); navigate('/'); }}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn-login" onClick={() => navigate('/login')}>Đăng nhập</button>
              <button className="btn-register" onClick={() => navigate('/register')}>Đăng ký</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
