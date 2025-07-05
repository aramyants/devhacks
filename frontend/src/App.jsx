import React from 'react';
import {
  Link,
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';

import Chat from './components/Chat';
import Company from './components/Company';
import CompanySettings from './components/CompanySettings';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Products from './components/Products';
import { TenantProvider } from './components/TenantContext';
import TenantSwitcher from './components/TenantSwitcher';

function Navigation() {
  const { pathname } = useLocation();

  const link = (to, label) => (
    <Link to={to} className={pathname === to ? 'active' : ''}>
      {label}
    </Link>
  );

  return (
    <nav className="navigation">
      <div className="nav-links">
        {link('/dashboard', 'Dashboard')}
        {/* {link('/companies', 'Company Mgmt')} */}
        {link('/company', 'Company Settings')}
        {link('/products', 'Products')}
        {/* {link('/chat', 'Chat Room')} */}
      </div>
    </nav>
  );
}

export default function App() {
  const [user, setUser] = React.useState(null);

  // Only show tenant switcher for admin
  const isAdmin = user?.role === 'admin';

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <TenantProvider>
      <Router>
        <header className="header">
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <h1 style={{ margin: 0 }}>Admin Panel</h1>
              {isAdmin && <TenantSwitcher />}
            </div>
            <Navigation />
            <div style={{ fontSize: 14, color: '#888' }}>
              {user.email} (<span style={{ color: '#3498db' }}>{user.role}</span>)
              <button style={{ marginLeft: 12, background: '#f5f6fa', color: '#888', border: '1.5px solid #e2e6ed', borderRadius: 8, fontWeight: 600, padding: '0.5rem 1.1rem', boxShadow: 'none', transition: 'background .18s' }} onClick={() => setUser(null)} onMouseOver={e => e.currentTarget.style.background='#e2e6ed'} onMouseOut={e => e.currentTarget.style.background='#f5f6fa'}>
                Logout
              </button>
            </div>
          </div>
        </header>
        <main className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/companies" element={<Company user={user} />} />
            <Route path="/company" element={<CompanySettings companyId={user.companyId} />} />
            <Route path="/products" element={<Products />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </main>
      </Router>
    </TenantProvider>
  );
}
