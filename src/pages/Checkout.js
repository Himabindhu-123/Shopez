import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { auth } from '../firebase';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', phone: '', street: '', city: '', pincode: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handlePlaceOrder() {
    if (!form.fullName || !form.phone || !form.street || !form.city || !form.pincode) {
      setError('Please fill all fields!');
      return;
    }
    if (cartItems.length === 0) {
      setError('Your cart is empty!');
      return;
    }
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/orders', {
        userEmail: auth.currentUser.email,
        items: cartItems.map(item => ({
          name: item.name,
          price: item.price,
          qty: item.qty,
          image: item.image,
        })),
        totalPrice,
        address: form,
      });
      setSuccess(true);
      clearCart();
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div style={styles.successPage}>
        <div style={styles.successCard}>
          <p style={styles.successIcon}>🎉</p>
          <h2 style={styles.successTitle}>Order Placed Successfully!</h2>
          <p style={styles.successText}>Thank you for shopping with ShopEZ!</p>
          <button style={styles.btn} onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Checkout</h2>
      <div className="checkout-layout" style={styles.layout}>
        <div style={styles.formCard}>
          <h3 style={styles.subHeading}>Delivery Address</h3>
          {error && <p style={styles.error}>{error}</p>}
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input style={styles.input} name="fullName" value={form.fullName} onChange={handleChange} placeholder="John Doe" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Phone Number</label>
            <input style={styles.input} name="phone" value={form.phone} onChange={handleChange} placeholder="9876543210" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Street Address</label>
            <input style={styles.input} name="street" value={form.street} onChange={handleChange} placeholder="123 Main Street" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>City</label>
            <input style={styles.input} name="city" value={form.city} onChange={handleChange} placeholder="Hyderabad" />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Pincode</label>
            <input style={styles.input} name="pincode" value={form.pincode} onChange={handleChange} placeholder="500001" />
          </div>

          <h3 style={{ ...styles.subHeading, marginTop: '20px' }}>Payment</h3>
          <div style={styles.paymentBox}>
            <p style={styles.paymentText}>💳 Cash on Delivery</p>
            <p style={styles.paymentSub}>Pay when your order arrives</p>
          </div>

          <button
            style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? 'Placing Order...' : `Place Order — ₹${totalPrice.toLocaleString('en-IN')}`}
          </button>
        </div>

        <div style={styles.summaryCard}>
          <h3 style={styles.subHeading}>Order Summary</h3>
          {cartItems.length === 0 && <p style={{ color: '#888', fontSize: '13px' }}>No items in cart</p>}
          {cartItems.map(item => (
            <div key={item._id} style={styles.summaryItem}>
              <img src={item.image} alt={item.name} style={styles.itemImg} />
              <div style={styles.itemInfo}>
                <p style={styles.itemName}>{item.name}</p>
                <p style={styles.itemQty}>Qty: {item.qty}</p>
              </div>
              <p style={styles.itemPrice}>₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
            </div>
          ))}
          <div style={styles.divider} />
          <div style={styles.totalRow}>
            <span>Delivery</span>
            <span style={{ color: '#16a34a' }}>Free</span>
          </div>
          <div style={{ ...styles.totalRow, fontWeight: '600', fontSize: '16px' }}>
            <span>Total</span>
            <span>₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '20px 24px' },
  heading: { fontSize: '22px', fontWeight: '600', marginBottom: '20px' },
  subHeading: { fontSize: '16px', fontWeight: '600', marginBottom: '12px' },
  layout: { display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px', alignItems: 'start' },
  formCard: { background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '20px' },
  summaryCard: { background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '20px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px' },
  label: { fontSize: '13px', color: '#555', fontWeight: '500' },
  input: { padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' },
  error: { fontSize: '13px', color: '#dc2626', background: '#fef2f2', padding: '8px 12px', borderRadius: '8px', marginBottom: '12px' },
  paymentBox: { background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', marginBottom: '20px' },
  paymentText: { fontSize: '14px', fontWeight: '500', marginBottom: '4px' },
  paymentSub: { fontSize: '12px', color: '#888' },
  btn: { width: '100%', padding: '14px', borderRadius: '8px', border: 'none', background: '#2563eb', color: 'white', fontSize: '15px', fontWeight: '500', cursor: 'pointer' },
  summaryItem: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' },
  itemImg: { width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', background: '#f5f5f5' },
  itemInfo: { flex: 1 },
  itemName: { fontSize: '13px', fontWeight: '500', marginBottom: '2px' },
  itemQty: { fontSize: '12px', color: '#888' },
  itemPrice: { fontSize: '13px', fontWeight: '600' },
  divider: { borderTop: '1px solid #eee', margin: '12px 0' },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' },
  successPage: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  successCard: { textAlign: 'center', padding: '40px', background: 'white', borderRadius: '16px', border: '1px solid #eee' },
  successIcon: { fontSize: '60px', marginBottom: '16px' },
  successTitle: { fontSize: '22px', fontWeight: '600', marginBottom: '8px' },
  successText: { fontSize: '14px', color: '#888', marginBottom: '24px' },
};

export default Checkout;