import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const { cartItems, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div style={styles.empty}>
        <p style={styles.emptyIcon}>🛒</p>
        <p style={styles.emptyText}>Your cart is empty!</p>
        <a href="/" style={styles.shopLink}>Continue Shopping</a>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Your Cart ({totalItems} items)</h2>

      <div style={styles.layout}>
        <div style={styles.itemsList}>
          {cartItems.map(item => (
            <div key={item._id} style={styles.itemCard}>
              <img src={item.image} alt={item.name} style={styles.itemImg} />
              <div style={styles.itemInfo}>
                <p style={styles.itemName}>{item.name}</p>
                <p style={styles.itemCat}>{item.category}</p>
                <p style={styles.itemPrice}>₹{item.price.toLocaleString('en-IN')} × {item.qty}</p>
              </div>
              <div style={styles.itemRight}>
                <p style={styles.itemTotal}>₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                <button style={styles.removeBtn} onClick={() => removeFromCart(item._id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.summaryCard}>
          <h3 style={styles.summaryHeading}>Order Summary</h3>
          <div style={styles.summaryRow}>
            <span>Items ({totalItems})</span>
            <span>₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Delivery</span>
            <span style={{ color: '#16a34a' }}>Free</span>
          </div>
          <div style={styles.divider} />
          <div style={{ ...styles.summaryRow, fontWeight: '600', fontSize: '16px' }}>
            <span>Total</span>
            <span>₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>
          <button style={styles.checkoutBtn} onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
          <button style={styles.clearBtn} onClick={clearCart}>Clear Cart</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '20px 24px' },
  heading: { fontSize: '22px', fontWeight: '600', marginBottom: '20px' },
  layout: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'start' },
  itemsList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  itemCard: { display: 'flex', gap: '14px', background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '14px', alignItems: 'center' },
  itemImg: { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', background: '#f5f5f5' },
  itemInfo: { flex: 1 },
  itemName: { fontWeight: '600', fontSize: '14px', marginBottom: '4px' },
  itemCat: { fontSize: '12px', color: '#888', marginBottom: '6px' },
  itemPrice: { fontSize: '13px', color: '#2563eb' },
  itemRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' },
  itemTotal: { fontWeight: '600', fontSize: '15px' },
  removeBtn: { padding: '4px 10px', borderRadius: '6px', border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontSize: '12px' },
  summaryCard: { background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' },
  summaryHeading: { fontSize: '16px', fontWeight: '600', marginBottom: '4px' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', fontSize: '14px' },
  divider: { borderTop: '1px solid #eee', margin: '4px 0' },
  checkoutBtn: { padding: '12px', borderRadius: '8px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
  clearBtn: { padding: '10px', borderRadius: '8px', border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontSize: '13px' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', gap: '12px' },
  emptyIcon: { fontSize: '60px' },
  emptyText: { fontSize: '18px', color: '#888' },
  shopLink: { padding: '10px 24px', background: '#2563eb', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '14px' },
};

export default Cart;