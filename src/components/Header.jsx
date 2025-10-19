import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header = ({ activeTab, onTabChange }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="logo">💰 Expense Tracker</h1>
        <nav className="nav">
          <button
            className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => onTabChange('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`nav-btn ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => onTabChange('expenses')}
          >
            Expenses
          </button>
          <button
            className={`nav-btn ${activeTab === 'splits' ? 'active' : ''}`}
            onClick={() => onTabChange('splits')}
          >
            Splits
          </button>
        </nav>
        <div className="user-section">
          <span className="user-name">👤 {user?.name}</span>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </div>
    </header>
  );
};

export default Header;