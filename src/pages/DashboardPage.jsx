import React, { useState, useEffect } from 'react';
import { expenseApi, incomeApi } from '../services/api';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expRes, incRes] = await Promise.all([
        expenseApi.getAll({}),
        incomeApi.getAll()
      ]);
      setExpenses(expRes.data || []);
      setIncome(incRes.data || []);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
  });

  const monthIncome = income.filter(inc => {
    const incDate = new Date(inc.date);
    return incDate.getMonth() === currentMonth && incDate.getFullYear() === currentYear;
  });

  const categories = [
    { name: 'Rent', icon: '🏠', budget: 15000 },
    { name: 'Groceries', icon: '🛒', budget: 5000 },
    { name: 'Shopping', icon: '🛍️', budget: 8000 },
    { name: 'Restaurants', icon: '🍽️', budget: 6000 },
    { name: 'Travel', icon: '✈️', budget: 5000 },
    { name: 'Utilities', icon: '⚡', budget: 2000 },
    { name: 'Entertainment', icon: '🎮', budget: 3000 },
    { name: 'Savings', icon: '💰', budget: 5000 },
    { name: 'Investments', icon: '📈', budget: 10000 },
    { name: 'Meat', icon: '🥩', budget: 2000 },
    { name: 'Vegetables', icon: '🥬', budget: 1500 },
  ];

  const totalBudget = categories.reduce((sum, cat) => sum + cat.budget, 0);
  const totalSpent = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalIncome = monthIncome.reduce((sum, inc) => sum + inc.amount, 0);
  const balance = totalIncome - totalSpent;

  const categoryStats = categories.map(cat => ({
    ...cat,
    spent: monthExpenses
      .filter(exp => exp.category === cat.name)
      .reduce((sum, exp) => sum + exp.amount, 0)
  }));

  const getMonthlyData = () => {
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      months.push({
        month: date.toLocaleString('default', { month: 'short' }),
        monthNum: date.getMonth(),
        year: date.getFullYear(),
        income: 0,
        spent: 0
      });
    }

    months.forEach(m => {
      m.income = income
        .filter(inc => {
          const incDate = new Date(inc.date);
          return incDate.getMonth() === m.monthNum && incDate.getFullYear() === m.year;
        })
        .reduce((sum, inc) => sum + inc.amount, 0);

      m.spent = expenses
        .filter(exp => {
          const expDate = new Date(exp.date);
          return expDate.getMonth() === m.monthNum && expDate.getFullYear() === m.year;
        })
        .reduce((sum, exp) => sum + exp.amount, 0);
    });

    return months;
  };

  const monthlyData = getMonthlyData();
  const maxValue = Math.max(...monthlyData.map(m => Math.max(m.income, m.spent)));

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 Dashboard</h1>
        <p>{now.toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card income">
          <p className="label">Total Income</p>
          <p className="amount">₹{totalIncome.toLocaleString()}</p>
          <p className="icon">💵</p>
        </div>

        <div className="summary-card spent">
          <p className="label">Total Spent</p>
          <p className="amount">₹{totalSpent.toLocaleString()}</p>
          <p className="icon">💸</p>
        </div>

        <div className={`summary-card ${balance >= 0 ? 'balance-positive' : 'balance-negative'}`}>
          <p className="label">Balance</p>
          <p className="amount">₹{balance.toLocaleString()}</p>
          <p className="icon">{balance >= 0 ? '✅' : '⚠️'}</p>
        </div>

        <div className="summary-card investment">
          <p className="label">Invested</p>
          <p className="amount">
            ₹{categoryStats.find(c => c.name === 'Investments')?.spent.toLocaleString()}
          </p>
          <p className="icon">📈</p>
        </div>

        {/* ✅ Added to use totalBudget */}
        <div className="summary-card budget">
          <p className="label">Total Budget</p>
          <p className="amount">₹{totalBudget.toLocaleString()}</p>
          <p className="icon">🧾</p>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="chart-section">
        <h2>📈 Monthly Income vs Spending</h2>
        <div className="chart-container">
          <div className="chart-legend">
            <div className="legend-item income-legend">
              <span className="dot"></span>
              <span>Income</span>
            </div>
            <div className="legend-item spent-legend">
              <span className="dot"></span>
              <span>Spent</span>
            </div>
          </div>

          <div className="bar-chart">
            {monthlyData.map((data, idx) => (
              <div key={idx} className="chart-bar-group">
                <div className="bars-container">
                  {/* Income Bar */}
                  <div className="bar-wrapper income-bar">
                    <div
                      className="bar"
                      style={{
                        height: `${(data.income / maxValue) * 150}px`,
                        backgroundColor: '#51CF66'
                      }}
                      title={`Income: ₹${data.income.toLocaleString()}`}
                    ></div>
                  </div>

                  {/* Spent Bar */}
                  <div className="bar-wrapper spent-bar">
                    <div
                      className="bar"
                      style={{
                        height: `${(data.spent / maxValue) * 150}px`,
                        backgroundColor: '#FF6B6B'
                      }}
                      title={`Spent: ₹${data.spent.toLocaleString()}`}
                    ></div>
                  </div>
                </div>
                <p className="month-label">{data.month}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="category-breakdown">
        <h2>Category Breakdown</h2>
        <div className="categories-list">
          {categoryStats.map(cat => {
            const percentage = (cat.spent / cat.budget) * 100;
            return (
              <div key={cat.name} className="category-row">
                <div className="category-left">
                  <span className="icon">{cat.icon}</span>
                  <div className="info">
                    <p className="name">{cat.name}</p>
                    <div className="progress-mini">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: percentage > 100 ? '#FF6B6B' : '#667eea'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="category-right">
                  <p className="spent">₹{cat.spent.toLocaleString()}</p>
                  <p className="budget">/ ₹{cat.budget}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
