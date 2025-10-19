import React, { useState, useEffect } from 'react';
import MonthlyReport from '../components/MonthlyReport';
import TopExpenses from '../components/TopExpenses';
import { statsApi } from '../services/api';
import '../styles/pages.css';

const ReportsPage = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [topExpenses, setTopExpenses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTopExpenses();
  }, []);

  const fetchTopExpenses = async () => {
    try {
      setLoading(true);
      const res = await statsApi.getTop({ limit: 10 });
      setTopExpenses(res.data);
    } catch (err) {
      console.error('Failed to fetch top expenses', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Reports & Analytics</h1>
        <p>View detailed reports and analyze your spending</p>
      </div>

      <div className="page-section">
        <div className="year-selector">
          <label>Select Year:</label>
          <select value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
            {[2021, 2022, 2023, 2024, 2025].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="page-section">
        <MonthlyReport year={year} />
      </div>

      <div className="page-section">
        <TopExpenses expenses={topExpenses} loading={loading} />
      </div>
    </div>
  );
};

export default ReportsPage;