import { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit() {
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.heading}>🛍️ ShopEZ</h2>
        <p style={styles.subheading}>{isRegister ? 'Create an account' : 'Welcome back!'}</p>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.formGroup}>
          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button
          style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
        </button>

        <p style={styles.toggle}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <span style={styles.toggleLink} onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? ' Login' : ' Register'}
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' },
  card: { background: 'white', padding: '40px', borderRadius: '16px', border: '1px solid #eee', width: '100%', maxWidth: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  heading: { fontSize: '24px', fontWeight: '700', textAlign: 'center', marginBottom: '6px' },
  subheading: { fontSize: '14px', color: '#888', textAlign: 'center', marginBottom: '24px' },
  error: { fontSize: '13px', color: '#dc2626', background: '#fef2f2', padding: '8px 12px', borderRadius: '8px', marginBottom: '16px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '16px' },
  label: { fontSize: '13px', color: '#555', fontWeight: '500' },
  input: { padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' },
  btn: { width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#2563eb', color: 'white', fontSize: '15px', fontWeight: '500', cursor: 'pointer', marginBottom: '16px' },
  toggle: { fontSize: '13px', color: '#888', textAlign: 'center' },
  toggleLink: { color: '#2563eb', cursor: 'pointer', fontWeight: '500' },
};

export default Login;