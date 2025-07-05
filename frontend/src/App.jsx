import React from "react";
import {
  Link,
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";

import Chat from "./components/Chat";
import Company from "./components/Company";
import CompanySettings from "./components/CompanySettings";
import Dashboard from "./components/Dashboard";
import AuthLayout from "./components/AuthLayout";
import Products from "./components/Products";
import { TenantProvider } from "./components/TenantContext";
import TenantSwitcher from "./components/TenantSwitcher";
import { AuthProvider, useAuth } from "./context/AuthContext";

function Navigation() {
  const { pathname } = useLocation();

  const link = (to, label) => (
    <Link to={to} className={pathname === to ? "active" : ""}>
      {label}
    </Link>
  );

  return (
    <nav className="navigation">
      <div className="nav-links">
        {link("/dashboard", "Dashboard")}
        {/* {link('/companies', 'Company Mgmt')} */}
        {link("/company", "Company Settings")}
        {link("/products", "Products")}
        {/* {link('/chat', 'Chat Room')} */}
      </div>
    </nav>
  );
}

function AppContent() {
  const { user, logout, loading } = useAuth();

  // Only show tenant switcher for admin
  const isAdmin = user?.role === "admin";

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthLayout />;
  }

  return (
    <TenantProvider>
      <Router>
        <header className="header">
          <div
            className="container"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <h1 style={{ margin: 0 }}>Admin Panel</h1>
              {isAdmin && <TenantSwitcher />}
            </div>
            <Navigation />
            <div className="user-info">
              <span className="user-details">
                {user.email}
                <span className="user-role">({user.role})</span>
              </span>
              <button className="logout-btn" onClick={logout}>
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
            <Route
              path="/company"
              element={<CompanySettings companyId={user.companyId} />}
            />
            <Route path="/products" element={<Products />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </main>
      </Router>
    </TenantProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
