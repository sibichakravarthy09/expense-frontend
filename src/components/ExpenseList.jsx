import React, { useState, useEffect } from 'react';
import { expenseApi } from '../services/api';
import './ExpenseList.css';

const ExpenseList = ({ refreshTrigger, filters = {} }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, [refreshTrigger, filters]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {};
      if (filters.split) params.split = filters.split;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;

      const res = await expenseApi.getAll(params);
      setExpenses(res.data || []);
    } catch (err) {
      console.error('Failed to fetch expenses', err);
      setError('Failed to load expenses');
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Delete this expense?')) {
      try {
        await expenseApi.delete(id);
        fetchExpenses();
      } catch (err) {
        console.error('Failed to delete expense', err);
        setError('Failed to delete expense');
      }
    }
  };

  const total = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  return (
    <div className="expense-list">
      <h2>Expense History</h2>

      {error && <div className="error-msg">{error}</div>}

      {loading ? (
        <p className="loading">Loading...</p>
      ) : expenses.length === 0 ? (
        <p className="no-data">No expenses found</p>
      ) : (
        <>
          <div className="expenses-table">
            <div className="table-header">
              <div>Date</div>
              <div>Description</div>
              <div>Category</div>
              <div>Paid By</div>
              <div>Amount</div>
              <div>Action</div>
            </div>
            {expenses.map(expense => (
              <div key={expense._id} className="table-row">
                <div>{new Date(expense.date).toLocaleDateString()}</div>
                <div>{expense.description}</div>
                <div>
                  <span 
                    className="category-badge"
                    style={{ backgroundColor: expense.split?.color || '#667eea' }}
                  >
                    {expense.split?.name || 'N/A'}
                  </span>
                </div>
                <div>{expense.paidBy || 'User'}</div>
                <div className="amount">₹{(expense.amount || 0).toFixed(2)}</div>
                <button 
                  onClick={() => handleDeleteExpense(expense._id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          <div className="total-row">
            <strong>Total: ₹{total.toFixed(2)}</strong>
          </div>
        </>
      )}
    </div>
  );
};

export default ExpenseList;