import React from 'react';
import './TopExpenses.css';

const TopExpenses = ({ expenses, loading }) => {
  return (
    <div className="top-expenses">
      <h2>Top 10 Highest Expenses</h2>
      
      {loading ? (
        <p>Loading...</p>
      ) : expenses.length === 0 ? (
        <p className="no-data">No expenses found</p>
      ) : (
        <div className="top-list">
          {expenses.map((expense, idx) => (
            <div key={expense._id} className="top-item">
              <div className="rank">#{idx + 1}</div>
              <div className="expense-details">
                <h4>{expense.description}</h4>
                <p>{expense.split.name} • {new Date(expense.date).toLocaleDateString()}</p>
              </div>
              <div className="amount">₹{expense.amount.toFixed(2)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopExpenses;