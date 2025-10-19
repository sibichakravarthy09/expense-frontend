import React, { useState, useEffect } from 'react';
import { expenseApi, splitApi } from '../services/api';
import './ExpenseForm.css';

const ExpenseForm = ({ onExpenseAdded }) => {
  const [splits, setSplits] = useState([]);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    split: '',
    paidBy: 'User',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSplits();
  }, []);

  const fetchSplits = async () => {
    try {
      const res = await splitApi.getAll();
      setSplits(res.data);
    } catch (err) {
      console.error('Failed to fetch splits', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.description.trim() || !formData.amount || !formData.split) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await expenseApi.create(formData);
      setFormData({
        description: '',
        amount: '',
        split: '',
        paidBy: 'User',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      onExpenseAdded();
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="expense-form">
      <h2>Add New Expense</h2>
      
      {error && <div className="error-msg">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Description *</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g., Grocery shopping"
              required
            />
          </div>

          <div className="form-group">
            <label>Amount *</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Split Category *</label>
            <select
              name="split"
              value={formData.split}
              onChange={handleChange}
              required
            >
              <option value="">Select a split</option>
              {splits.map(split => (
                <option key={split._id} value={split._id}>{split.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Paid By</label>
            <input
              type="text"
              name="paidBy"
              value={formData.paidBy}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Optional notes"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Expense'}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;