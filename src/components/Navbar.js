import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { auth } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';

function Navbar() {
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  async function handleLogout() {
    await signOut(auth);
    navigate('/login');
    setMenuOpen(false);
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🛍️ ShopEZ</Link>

      <button className="nav-hamburger" style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? '✕' : '☰'}
      </button>

      <div className="nav-links" style={styles.links}>
        <Link to="/" style={styles.link}>Store</Link>
        <Link to="/admin" style={styles.link}>Admin</Link>
        <Link to="/orders" style={styles.link}>Orders</Link>
        <Link to="/cart" style={styles.link}>
          🛒 Cart {totalItems > 0 && (
            <span style={styles.badge}>{totalItems}</span>
          )}
        </Link>
        {user ? (
          <>
            <span style={styles.email}>👤 {user.email}</span>
            <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login" style={styles.loginBtn}>Login</Link>
        )}
      </div>

      {menuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Store</Link>
          <Link to="/admin" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Admin</Link>
          <Link to="/orders" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Orders</Link>
          <Link to="/cart" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>
            🛒 Cart {totalItems > 0 && `(${totalItems})`}
          </Link>
          {user ? (
            <>
              <span style={styles.mobileEmail}>👤 {user.email}</span>
              <button style={styles.mobileLogout} onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', backgroundColor: '#2563eb', color: 'white', flexWrap: 'wrap' },
  brand: { color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' },
  hamburger: { display: 'none', background: 'none', border: 'none', color: 'white', fontSize: '22px', cursor: 'pointer' },
  links: { display: 'flex', gap: '20px', alignItems: 'center' },
  link: { color: 'white', textDecoration: 'none', fontSize: '15px' },
  badge: { backgroundColor: 'red', color: 'white', borderRadius: '50%', padding: '2px 7px', fontSize: '11px', marginLeft: '4px' },
  email: { color: 'white', fontSize: '13px' },
  logoutBtn: { padding: '6px 14px', borderRadius: '8px', border: 'none', background: 'white', color: '#2563eb', cursor: 'pointer', fontSize: '13px', fontWeight: '500' },
  loginBtn: { padding: '6px 14px', borderRadius: '8px', border: '1px solid white', color: 'white', textDecoration: 'none', fontSize: '13px' },
  mobileMenu: { display: 'flex', flexDirection: 'column', width: '100%', backgroundColor: '#1d4ed8', marginTop: '10px', borderRadius: '8px', overflow: 'hidden' },
  mobileLink: { color: 'white', textDecoration: 'none', fontSize: '15px', padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' },
  mobileEmail: { color: 'rgba(255,255,255,0.75)', fontSize: '13px', padding: '12px 20px' },
  mobileLogout: { background: 'none', border: 'none', color: '#fca5a5', fontSize: '15px', padding: '12px 20px', textAlign: 'left', cursor: 'pointer' },
};

export default Navbar;