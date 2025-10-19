import React, { useState } from 'react';
import '../styles/splits.css';

const Splits = () => {
  const [splits, setSplits] = useState([]);
  const [newSplit, setNewSplit] = useState({
    name: '',
    members: 2,
    amount: '',
    category: 'Budget',
    description: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = [
    { name: 'Budget', icon: '💼' },
    { name: 'Groceries', icon: '🛒' },
    { name: 'Food', icon: '🍽️' },
    { name: 'Travel', icon: '✈️' },
    { name: 'Entertainment', icon: '🎮' },
    { name: 'Home', icon: '🏠' },
    { name: 'Office', icon: '🏢' },
  ];

  const handleCreateSplit = (e) => {
    e.preventDefault();
    setError('');

    if (!newSplit.name || !newSplit.amount || newSplit.members < 2) {
      setError('Fill all fields');
      return;
    }

    const split = {
      _id: Date.now().toString(),
      name: newSplit.name,
      members: parseInt(newSplit.members),
      amount: parseFloat(newSplit.amount),
      category: newSplit.category,
      description: newSplit.description,
      perPerson: (parseFloat(newSplit.amount) / parseInt(newSplit.members)).toFixed(2),
      createdAt: new Date()
    };

    setSplits([split, ...splits]);
    setSuccess('✨ Split created!');
    setNewSplit({ name: '', members: 2, amount: '', category: 'Budget', description: '' });
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleDeleteSplit = (id) => {
    if (window.confirm('Delete split?')) {
      setSplits(splits.filter(s => s._id !== id));
    }
  };

  return (
    <div className="splits-page">
      <div className="split-header">
        <h1>👥 Split Expenses</h1>
        
      </div>

      {error && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}

      {/* Create Split Form */}
      <div className="create-split">
        <h2>Create New Split</h2>
        <form onSubmit={handleCreateSplit}>
          <div className="form-row">
            <div className="form-group">
              <label>Split Name (Home/Office/Roommates)</label>
              <input
                type="text"
                value={newSplit.name}
                onChange={(e) => setNewSplit({ ...newSplit, name: e.target.value })}
                placeholder="e.g., Home, Office, Roommates"
              />
            </div>
            <div className="form-group">
              <label>Members</label>
              <select
                value={newSplit.members}
                onChange={(e) => setNewSplit({ ...newSplit, members: e.target.value })}
              >
                {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <option key={n} value={n}>{n} people</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Total Amount</label>
              <input
                type="number"
                value={newSplit.amount}
                onChange={(e) => setNewSplit({ ...newSplit, amount: e.target.value })}
                placeholder="₹ 0.00"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                value={newSplit.category}
                onChange={(e) => setNewSplit({ ...newSplit, category: e.target.value })}
              >
                {categories.map(cat => (
                  <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group full">
            <label>Description (Optional)</label>
            <input
              type="text"
              value={newSplit.description}
              onChange={(e) => setNewSplit({ ...newSplit, description: e.target.value })}
              placeholder="e.g., Rent payment, Office lunch"
            />
          </div>

          <button type="submit" className="btn btn-primary">+ Create Split</button>
        </form>
      </div>

      {/* Splits List */}
      <div className="splits-list">
        <h2>Your Splits</h2>
        {splits.length === 0 ? (
          <p className="no-data">No splits created yet</p>
        ) : (
          splits.map(split => (
            <div key={split._id} className="split-card">
              <div className="split-top">
                <div className="split-icon">
                  {categories.find(c => c.name === split.category)?.icon}
                </div>
                <div className="split-info">
                  <p className="split-name">{split.name}</p>
                  <p className="split-desc">{split.description}</p>
                </div>
                <button className="btn-delete" onClick={() => handleDeleteSplit(split._id)}>✕</button>
              </div>

              <div className="split-details">
                <div className="detail-item">
                  <span className="label">Category</span>
                  <span className="value">{split.category}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Total</span>
                  <span className="value amount">₹{split.amount.toLocaleString()}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Members</span>
                  <span className="value">{split.members}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Per Person</span>
                  <span className="value amount">₹{split.perPerson}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Splits;