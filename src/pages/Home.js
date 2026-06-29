import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Books', 'Sports'];

const fallbackProducts = [
  { _id: '1', name: 'Wireless Headphones', category: 'Electronics', price: 1299, stock: 'in', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&q=80' },
  { _id: '2', name: 'Cotton Kurta', category: 'Fashion', price: 499, stock: 'in', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300&q=80' },
  { _id: '3', name: 'Table Lamp', category: 'Home', price: 799, stock: 'low', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=300&q=80' },
  { _id: '4', name: 'JavaScript Book', category: 'Books', price: 349, stock: 'in', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80' },
  { _id: '5', name: 'Yoga Mat', category: 'Sports', price: 599, stock: 'in', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&q=80' },
  { _id: '6', name: 'Bluetooth Speaker', category: 'Electronics', price: 1899, stock: 'low', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&q=80' },
  { _id: '7', name: 'Denim Jacket', category: 'Fashion', price: 999, stock: 'in', image: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=300&q=80' },
  { _id: '8', name: 'Ceramic Mug Set', category: 'Home', price: 449, stock: 'in', image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300&q=80' },
];

function Home() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState(fallbackProducts);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('default');
  const [added, setAdded] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => {
        if (res.data.length > 0) setProducts(res.data);
      })
      .catch(() => {
        console.log('Using fallback products');
      });
  }, []);

  let filtered = products.filter(p => {
    const matchCat = category === 'All' || p.category === category;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  if (sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);

  function handleAddToCart(product) {
    addToCart(product);
    setAdded(product._id);
    setTimeout(() => setAdded(null), 1000);
  }

  return (
    <div style={styles.page}>
      <div style={styles.controls}>
        <input
          style={styles.input}
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select style={styles.select} value={sort} onChange={e => setSort(e.target.value)}>
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div style={styles.pills}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            style={{ ...styles.pill, ...(category === cat ? styles.pillActive : {}) }}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={styles.grid}>
        {filtered.length === 0 && <p style={{ color: '#888' }}>No products found.</p>}
        {filtered.map(product => (
          <div key={product._id} style={styles.card}>
            <img src={product.image} alt={product.name} style={styles.cardImg} />
            <div style={styles.cardBody}>
              <p style={styles.cardName}>{product.name}</p>
              <p style={styles.cardCat}>{product.category}</p>
              <div style={styles.cardFooter}>
                <span style={styles.price}>₹{product.price.toLocaleString('en-IN')}</span>
                <span style={product.stock === 'in' ? styles.inStock : styles.lowStock}>
                  {product.stock === 'in' ? 'In stock' : 'Low stock'}
                </span>
              </div>
              <button
                style={{ ...styles.addBtn, ...(added === product._id ? styles.addedBtn : {}) }}
                onClick={() => handleAddToCart(product)}
              >
                {added === product._id ? '✅ Added!' : 'Add to cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '20px 24px' },
  controls: { display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' },
  input: { flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', minWidth: '160px' },
  select: { padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' },
  pills: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' },
  pill: { padding: '6px 14px', borderRadius: '999px', border: '1px solid #ddd', background: 'white', cursor: 'pointer', fontSize: '13px' },
  pillActive: { background: '#2563eb', color: 'white', borderColor: '#2563eb' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' },
  card: { border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden', background: 'white' },
  cardImg: { width: '100%', height: '160px', objectFit: 'cover', background: '#f5f5f5' },
  cardBody: { padding: '12px' },
  cardName: { fontWeight: '600', fontSize: '14px', marginBottom: '4px' },
  cardCat: { fontSize: '12px', color: '#888', marginBottom: '8px' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  price: { fontWeight: '600', color: '#2563eb', fontSize: '15px' },
  inStock: { fontSize: '11px', background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '999px' },
  lowStock: { fontSize: '11px', background: '#fef9c3', color: '#ca8a04', padding: '2px 8px', borderRadius: '999px' },
  addBtn: { width: '100%', padding: '8px', borderRadius: '8px', border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer', fontSize: '13px' },
  addedBtn: { background: '#16a34a' },
};

export default Home;