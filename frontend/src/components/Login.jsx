import React, { useState } from 'react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Simulate login (replace with real API call)
    setTimeout(() => {
      if (email === 'admin@saas.com') {
        onLogin({ email, role: 'admin' });
      } else if (email === 'owner@acme.com') {
        onLogin({ email, role: 'owner', companyId: 1 });
      } else if (email === 'owner@globex.com') {
        onLogin({ email, role: 'owner', companyId: 2 });
      } else {
        setError('Invalid credentials or not a company owner/admin.');
      }
      setLoading(false);
    }, 900);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
        {error && <div className="error">{error}</div>}
        <div style={{ fontSize: 13, color: '#888', marginTop: 8 }}>
          <b>Demo logins:</b><br />
          Admin: <b>admin@saas.com</b><br />
          Acme Owner: <b>owner@acme.com</b><br />
          Globex Owner: <b>owner@globex.com</b>
        </div>
      </form>
    </div>
  );
}
