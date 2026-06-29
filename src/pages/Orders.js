import { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/${auth.currentUser.email}`);
      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }

  if (loading) return <p style={{ padding: '24px' }}>Loading orders...</p>;

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>My Orders</h2>

      {orders.length === 0 ? (
        <div style={styles.empty}>
          <p style={styles.emptyIcon}>📦</p>
          <p style={styles.emptyText}>No orders yet!</p>
          <button style={styles.shopBtn} onClick={() => navigate('/')}>Start Shopping</button>
        </div>
      ) : (
        <div style={styles.ordersList}>
          {orders.slice().reverse().map(order => (
            <div key={order._id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <div>
                  <p style={styles.orderId}>Order #{order._id.slice(-6).toUpperCase()}</p>
                  <p style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div style={styles.orderRight}>
                  <span style={styles.statusBadge}>{order.status}</span>
                  <p style={styles.orderTotal}>₹{order.totalPrice.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div style={styles.itemsRow}>
                {order.items.map((item, i) => (
                  <div key={i} style={styles.item}>
                    <img src={item.image} alt={item.name} style={styles.itemImg} />
                    <div>
                      <p style={styles.itemName}>{item.name}</p>
                      <p style={styles.itemQty}>Qty: {item.qty} × ₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div style={styles.addressBox}>
                <p style={styles.addressLabel}>📍 Delivery Address</p>
                <p style={styles.addressText}>
                  {order.address.fullName}, {order.address.street}, {order.address.city} - {order.address.pincode}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: '20px 24px' },
  heading: { fontSize: '22px', fontWeight: '600', marginBottom: '20px' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 20px', gap: '12px' },
  emptyIcon: { fontSize: '60px' },
  emptyText: { fontSize: '18px', color: '#888' },
  shopBtn: { padding: '10px 24px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  ordersList: { display: 'flex', flexDirection: 'column', gap: '16px' },
  orderCard: { background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '16px' },
  orderHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' },
  orderId: { fontWeight: '600', fontSize: '15px', marginBottom: '4px' },
  orderDate: { fontSize: '12px', color: '#888' },
  orderRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' },
  statusBadge: { fontSize: '11px', padding: '3px 10px', borderRadius: '999px', background: '#dbeafe', color: '#2563eb' },
  orderTotal: { fontWeight: '600', fontSize: '16px' },
  itemsRow: { display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' },
  item: { display: 'flex', gap: '12px', alignItems: 'center' },
  itemImg: { width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px', background: '#f5f5f5' },
  itemName: { fontSize: '13px', fontWeight: '500', marginBottom: '2px' },
  itemQty: { fontSize: '12px', color: '#888' },
  addressBox: { background: '#f8fafc', borderRadius: '8px', padding: '10px 12px' },
  addressLabel: { fontSize: '12px', fontWeight: '500', marginBottom: '4px' },
  addressText: { fontSize: '12px', color: '#555' },
};

export default Orders;