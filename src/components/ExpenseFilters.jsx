import React from 'react';
import './ExpenseFilters.css';

const ExpenseFilters = ({ splits, filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    onFilterChange({ split: '', startDate: '', endDate: '' });
  };

  return (
    <div className="expense-filters">
      <h3>Filter Expenses</h3>
      <div className="filters-container">
        <div className="filter-group">
          <label>Split Category</label>
          <select 
            name="split" 
            value={filters.split} 
            onChange={handleChange}
          >
            <option value="">All Categories</option>
            {splits.map(split => (
              <option key={split._id} value={split._id}>{split.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Start Date</label>
          <input 
            type="date" 
            name="startDate" 
            value={filters.startDate} 
            onChange={handleChange}
          />
        </div>

        <div className="filter-group">
          <label>End Date</label>
          <input 
            type="date" 
            name="endDate" 
            value={filters.endDate} 
            onChange={handleChange}
          />
        </div>

        <button onClick={handleReset} className="btn btn-secondary">Reset Filters</button>
      </div>
    </div>
  );
};

export default ExpenseFilters;