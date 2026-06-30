function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.section}>
          <h3 style={styles.brand}>🛍️ ShopEZ</h3>
          <p style={styles.tagline}>One-stop e-commerce platform for online purchases.</p>
        </div>

        <div style={styles.section}>
          <h4 style={styles.heading}>Quick Links</h4>
          <a href="/" style={styles.link}>Store</a>
          <a href="/cart" style={styles.link}>Cart</a>
          <a href="/orders" style={styles.link}>Orders</a>
          <a href="/login" style={styles.link}>Login</a>
        </div>

        <div style={styles.section}>
          <h4 style={styles.heading}>Categories</h4>
          <p style={styles.text}>Electronics</p>
          <p style={styles.text}>Fashion</p>
          <p style={styles.text}>Home</p>
          <p style={styles.text}>Books</p>
          <p style={styles.text}>Sports</p>
        </div>

        <div style={styles.section}>
          <h4 style={styles.heading}>Contact</h4>
          <p style={styles.text}>📧 support@shopez.com</p>
          <p style={styles.text}>📞 +91 1234567890</p>
          <p style={styles.text}>📍 Tirupati, Andhra Pradesh</p>
        </div>
      </div>

      <div style={styles.bottom}>
        <p style={styles.bottomText}>© 2026 ShopEZ. All rights reserved. Made with ❤️ by Himabindhu</p>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: 'linear-gradient(135deg, #1e40af, #2563eb)',
    color: 'white',
    marginTop: '40px',
  },
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '32px',
    padding: '40px 28px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  brand: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '4px',
  },
  tagline: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.75)',
    lineHeight: '1.5',
  },
  heading: {
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '4px',
    color: 'rgba(255,255,255,0.9)',
  },
  link: {
    color: 'rgba(255,255,255,0.75)',
    textDecoration: 'none',
    fontSize: '13px',
  },
  text: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: '13px',
    margin: '0',
  },
  bottom: {
    borderTop: '1px solid rgba(255,255,255,0.2)',
    padding: '16px 28px',
    textAlign: 'center',
  },
  bottomText: {
    fontSize: '13px',
    color: 'rgba(255,255,255,0.75)',
  },
};

export default Footer;