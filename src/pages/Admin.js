import { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../firebase';

const CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Books', 'Sports'];
const adminEmail = 'bindhuhima707@gmail.com';
function Admin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', category: 'Electronics', price: '', stock: 'in', image: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data);
    } catch (err) {
      setError('Failed to fetch products');
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleAdd() {
    if (!form.name || !form.price) {
      setError('Please fill in name and price!');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/products', {
        name: form.name,
        category: form.category,
        price: parseInt(form.price),
        stock: form.stock,
        image: form.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80',
      });
      setForm({ name: '', category: 'Electronics', price: '', stock: 'in', image: '' });
      setMessage('Product added successfully!');
      setError('');
      setTimeout(() => setMessage(''), 2000);
      fetchProducts();
    } catch (err) {
      setError('Failed to add product');
    }
  }

  async function handleDelete(id) {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      setMessage('Product deleted!');
      setTimeout(() => setMessage(''), 2000);
      fetchProducts();
    } catch (err) {
      setError('Failed to delete product');
    }
  }

  if (!currentUser || currentUser.email !== adminEmail) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <p style={{ fontSize: '40px' }}>🚫</p>
        <h2 style={{ fontSize: '22px', marginBottom: '8px' }}>Access Denied</h2>
        <p style={{ color: '#888' }}>You don't have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h2 style={styles.heading}>Admin Panel</h2>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total Products</p>
          <p style={styles.statVal}>{products.length}</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Total Orders</p>
          <p style={styles.statVal}>12</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Revenue</p>
          <p style={styles.statVal}>₹24,580</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>Users</p>
          <p style={styles.statVal}>38</p>
        </div>
      </div>

      <div style={styles.sections}>
        <div style={styles.formCard}>
          <h3 style={styles.subHeading}>Add Product</h3>
          {message && <p style={styles.success}>{message}</p>}
          {error && <p style={styles.error}>{error}</p>}
          <label style={styles.label}>Name</label>
          <input style={styles.input} name="name" value={form.name} onChange={handleChange} placeholder="e.g. Running shoes" />
          <label style={styles.label}>Category</label>
          <select style={styles.input} name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <label style={styles.label}>Price (₹)</label>
          <input style={styles.input} name="price" value={form.price} onChange={handleChange} placeholder="499" type="number" />
          <label style={styles.label}>Stock</label>
          <select style={styles.input} name="stock" value={form.stock} onChange={handleChange}>
            <option value="in">In stock</option>
            <option value="low">Low stock</option>
          </select>
          <label style={styles.label}>Image URL (optional)</label>
          <input style={styles.input} name="image" value={form.image} onChange={handleChange} placeholder="https://..." />
          <button style={styles.addBtn} onClick={handleAdd}>Add Product</button>
        </div>

        <div style={styles.tableCard}>
          <h3 style={styles.subHeading}>Products ({products.length})</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Image</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Stock</th>
                <th style={styles.th}></th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td style={styles.td}>
                    <img src={p.image} alt={p.name} style={styles.productImg} />
                  </td>
                  <td style={styles.td}>{p.name}</td>
                  <td style={styles.td}>{p.category}</td>
                  <td style={styles.td}>₹{p.price}</td>
                  <td style={styles.td}>
                    <span style={p.stock === 'in' ? styles.inStock : styles.lowStock}>
                      {p.stock === 'in' ? 'In stock' : 'Low'}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(p._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '20px 24px' },
  heading: { fontSize: '22px', fontWeight: '600', marginBottom: '20px' },
  subHeading: { fontSize: '16px', fontWeight: '600', marginBottom: '12px' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '24px' },
  statCard: { background: '#f8fafc', borderRadius: '10px', padding: '14px', border: '1px solid #eee' },
  statLabel: { fontSize: '12px', color: '#888', marginBottom: '6px' },
  statVal: { fontSize: '24px', fontWeight: '600' },
  sections: { display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' },
  formCard: { background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' },
  tableCard: { background: 'white', border: '1px solid #eee', borderRadius: '12px', padding: '16px', overflowX: 'auto' },
  label: { fontSize: '12px', color: '#888' },
  input: { padding: '8px 10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '13px', width: '100%' },
  addBtn: { marginTop: '8px', padding: '10px', borderRadius: '8px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
  success: { fontSize: '13px', color: '#16a34a', background: '#dcfce7', padding: '6px 10px', borderRadius: '6px' },
  error: { fontSize: '13px', color: '#dc2626', background: '#fef2f2', padding: '6px 10px', borderRadius: '6px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  th: { textAlign: 'left', padding: '8px 6px', borderBottom: '1px solid #eee', color: '#888', fontWeight: '500', fontSize: '12px' },
  td: { padding: '8px 6px', borderBottom: '1px solid #f5f5f5', verticalAlign: 'middle' },
  productImg: { width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', background: '#f5f5f5' },
  inStock: { fontSize: '11px', background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '999px' },
  lowStock: { fontSize: '11px', background: '#fef9c3', color: '#ca8a04', padding: '2px 8px', borderRadius: '999px' },
  deleteBtn: { padding: '4px 10px', borderRadius: '6px', border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontSize: '12px' },
};

export default Admin;