import React, { useState, useEffect } from 'react';
import { expenseApi, incomeApi } from '../services/api';
import '../styles/expenses.css';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'Rent',
    date: new Date().toISOString().split('T')[0]
  });
  const [newIncome, setNewIncome] = useState({
    amount: '',
    source: 'Salary',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tab, setTab] = useState('income');

  const categories = [
    { name: 'Rent', icon: '🏠' },
    { name: 'Groceries', icon: '🛒' },
    { name: 'Shopping', icon: '🛍️' },
    { name: 'Restaurants', icon: '🍽️' },
    { name: 'Travel', icon: '✈️' },
    { name: 'Utilities', icon: '⚡' },
    { name: 'Entertainment', icon: '🎮' },
    { name: 'Savings', icon: '💰' },
    { name: 'Investments', icon: '📈' },
    { name: 'Meat', icon: '🥩' },
    { name: 'Vegetables', icon: '🥬' },
  ];

  const incomeSources = ['Salary', 'Freelance', 'Business', 'Investment', 'Bonus', 'Other'];

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
      setError('❌ Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newIncome.amount) {
      setError('⚠️ Income amount required');
      return;
    }

    try {
      setLoading(true);
      await incomeApi.create(newIncome);
      setSuccess('✨ Income added!');
      setNewIncome({
        amount: '',
        source: 'Salary',
        date: new Date().toISOString().split('T')[0]
      });
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add income');
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newExpense.description || !newExpense.amount) {
      setError('⚠️ Description and amount required');
      return;
    }

    try {
      setLoading(true);
      await expenseApi.create(newExpense);
      setSuccess('✨ Expense added!');
      setNewExpense({
        description: '',
        amount: '',
        category: 'Rent',
        date: new Date().toISOString().split('T')[0]
      });
      await fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add expense');
    } finally {
      setLoading(false);
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const handleDeleteIncome = async (id) => {
    if (!window.confirm('Delete this income?')) return;
    try {
      setLoading(true);
      await incomeApi.delete(id);
      await fetchData();
    } catch {
      setError('Failed to delete income');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      setLoading(true);
      await expenseApi.delete(id);
      await fetchData();
    } catch {
      setError('Failed to delete expense');
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = income.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="expenses-page">
      <div className="exp-header">
        <h1>💰 Income & Expenses</h1>
        <div className="header-stats">
          <div className="stat-item income">
            <span className="label">Income</span>
            <span className="amount">₹{totalIncome.toLocaleString()}</span>
          </div>
          <div className="stat-item expense">
            <span className="label">Expense</span>
            <span className="amount">₹{totalExpense.toLocaleString()}</span>
          </div>
          <div className={`stat-item ${balance >= 0 ? 'positive' : 'negative'}`}>
            <span className="label">Balance</span>
            <span className="amount">₹{balance.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {error && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}
      {loading && <div className="loading">⏳ Loading...</div>}

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab-btn ${tab === 'income' ? 'active' : ''}`}
          onClick={() => setTab('income')}
        >
          💵 Income
        </button>
        <button
          className={`tab-btn ${tab === 'expense' ? 'active' : ''}`}
          onClick={() => setTab('expense')}
        >
          💸 Expenses
        </button>
      </div>

      {/* INCOME TAB */}
      {tab === 'income' && (
        <div className="tab-content">
          <div className="add-form">
            <h2>Add Income</h2>
            <form onSubmit={handleAddIncome}>
              <div className="form-row">
                <div className="form-group">
                  <label>Amount *</label>
                  <input
                    type="number"
                    value={newIncome.amount}
                    onChange={(e) =>
                      setNewIncome({ ...newIncome, amount: e.target.value })
                    }
                    placeholder="₹ 0.00"
                    step="0.01"
                  />
                </div>
                <div className="form-group">
                  <label>Source</label>
                  <select
                    value={newIncome.source}
                    onChange={(e) =>
                      setNewIncome({ ...newIncome, source: e.target.value })
                    }
                  >
                    {incomeSources.map((src) => (
                      <option key={src} value={src}>
                        {src}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group full">
                <label>Date</label>
                <input
                  type="date"
                  value={newIncome.date}
                  onChange={(e) =>
                    setNewIncome({ ...newIncome, date: e.target.value })
                  }
                />
              </div>

              <button type="submit" className="btn btn-primary">
                + Add Income
              </button>
            </form>
          </div>

          <div className="list-section">
            <h2>Income History</h2>
            {income.length === 0 ? (
              <p className="no-data">No income added yet</p>
            ) : (
              income.map((inc) => (
                <div key={inc._id} className="item">
                  <div className="item-icon">💵</div>
                  <div className="item-info">
                    <p className="item-desc">{inc.source}</p>
                    <p className="item-date">
                      {new Date(inc.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="item-amount">
                    <p>₹{inc.amount.toLocaleString()}</p>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteIncome(inc._id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* EXPENSE TAB */}
      {tab === 'expense' && (
        <div className="tab-content">
          <div className="add-form">
            <h2>Add Expense</h2>
            <form onSubmit={handleAddExpense}>
              <div className="form-row">
                <div className="form-group">
                  <label>Description *</label>
                  <input
                    type="text"
                    value={newExpense.description}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, description: e.target.value })
                    }
                    placeholder="What did you spend on?"
                  />
                </div>
                <div className="form-group">
                  <label>Amount *</label>
                  <input
                    type="number"
                    value={newExpense.amount}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, amount: e.target.value })
                    }
                    placeholder="₹ 0.00"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newExpense.category}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, category: e.target.value })
                    }
                  >
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) =>
                      setNewExpense({ ...newExpense, date: e.target.value })
                    }
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                + Add Expense
              </button>
            </form>
          </div>

          <div className="list-section">
            <h2>Expense History</h2>
            {expenses.length === 0 ? (
              <p className="no-data">No expenses yet</p>
            ) : (
              expenses.map((exp) => (
                <div key={exp._id} className="item">
                  <div className="item-icon">
                    {categories.find((c) => c.name === exp.category)?.icon}
                  </div>
                  <div className="item-info">
                    <p className="item-desc">{exp.description}</p>
                    <p className="item-date">
                      {new Date(exp.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="item-amount">
                    <p>₹{exp.amount.toLocaleString()}</p>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteExpense(exp._id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
