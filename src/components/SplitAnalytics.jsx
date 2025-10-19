import React from 'react';
import './SplitAnalytics.css';

const SplitAnalytics = ({ splits, splitStats }) => {
  return (
    <div className="split-analytics">
      <h2>Split Analytics</h2>
      <div className="analytics-grid">
        {splits.map(split => {
          const stats = splitStats[split._id] || { count: 0, total: 0 };
          return (
            <div key={split._id} className="analytics-card">
              <div 
                className="analytics-color" 
                style={{ backgroundColor: split.color }}
              ></div>
              <h4>{split.name}</h4>
              <p className="analytics-total">₹{stats.total.toFixed(2)}</p>
              <p className="analytics-count">{stats.count} expenses</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SplitAnalytics;