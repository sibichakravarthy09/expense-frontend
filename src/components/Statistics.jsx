import React, { useState, useEffect } from 'react';
import { statsApi } from '../services/api';
import './Statistics.css';

const Statistics = ({ refreshTrigger }) => {
  const [summary, setSummary] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [expenseCount, setExpenseCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSummary();
  }, [refreshTrigger]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await statsApi.getSummary();
      
      // Safely handle the response
      if (res && res.summary) {
        setSummary(res.summary || {});
        setTotalAmount(res.totalAmount || 0);
        setExpenseCount(res.expenseCount || 0);
      } else {
        setSummary({});
        setTotalAmount(0);
        setExpenseCount(0);
      }
    } catch (err) {
      console.error('Failed to fetch stats', err);
      setError('Failed to load statistics');
      setSummary({});
      setTotalAmount(0);
      setExpenseCount(0);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="statistics">
      <h2>Summary by Split</h2>

      {error && <div className="error-msg">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : Object.keys(summary).length === 0 ? (
        <p className="no-data">No expenses yet. Start by adding an expense!</p>
      ) : (
        <>
          <div className="stats-grid">
            {Object.entries(summary).map(([splitName, data]) => (
              <div key={splitName} className="stat-card">
                <div 
                  className="stat-color"
                  style={{ backgroundColor: data.color || '#667eea' }}
                ></div>
                <div className="stat-info">
                  <h4>{splitName}</h4>
                  <p className="stat-amount">₹{(data.total || 0).toFixed(2)}</p>
                  <p className="stat-count">{data.count || 0} expense(s)</p>
                </div>
              </div>
            ))}
          </div>

          <div className="total-summary">
            <h3>Grand Total</h3>
            <p className="grand-total">₹{(totalAmount || 0).toFixed(2)}</p>
            <p className="total-count">Total Expenses: {expenseCount}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Statistics;