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
import Products from './components/Products';

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
  return (
    <Router>
      <header className="header">
        <div className="container">
          <h1>Admin Panel</h1>
          <Navigation />
        </div>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/companies" element={<Company />} />
          <Route path="/company" element={<CompanySettings />} />
          <Route path="/products" element={<Products />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </main>
    </Router>
  );
}
