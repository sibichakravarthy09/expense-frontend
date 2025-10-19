import React, { useContext } from 'react';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Dashboard from './pages/DashboardPage';
import Expenses from './pages/ExpensesPage';
import Splits from './pages/SplitsPage';
import LoginPage from './pages/LoginPage';
import './App.css';

function AppContent() {
  const { user, loading } = useContext(AuthContext);
  const [activeTab, setActiveTab] = React.useState('dashboard');

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!user) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'expenses':
        return <Expenses />;
      case 'splits':
        return <Splits />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main-content">
        <div className="container">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
