
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Company from './components/Company';
import Chat from './components/Chat';

function Navigation() {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-links">
        <Link 
          to="/companies" 
          className={location.pathname === '/companies' ? 'active' : ''}
        >
          Company Management
        </Link>
        <Link 
          to="/chat" 
          className={location.pathname === '/chat' ? 'active' : ''}
        >
          Chat Room
        </Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <header className="header">
          <div className="container">
            <h1>Admin Panel</h1>
            <Navigation />
          </div>
        </header>

        <main className="container">
          <Routes>
            <Route path="/" element={<Company />} />
            <Route path="/companies" element={<Company />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
