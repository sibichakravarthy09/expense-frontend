import React, { useState, useEffect } from 'react';
import { statsApi } from '../services/api';
import './MonthlyReport.css';

const MonthlyReport = ({ year }) => {
  const [monthlyData, setMonthlyData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMonthlyData();
  }, [year]);

  const fetchMonthlyData = async () => {
    try {
      setLoading(true);
      const res = await statsApi.getMonthly({ year });
      setMonthlyData(res.data.monthlyData);
    } catch (err) {
      console.error('Failed to fetch monthly data', err);
    } finally {
      setLoading(false);
    }
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const monthTotals = months.map(month => {
    const month_data = monthlyData[month] || {};
    return Object.values(month_data).reduce((sum, val) => sum + val, 0);
  });

  const maxTotal = Math.max(...monthTotals, 1);

  return (
    <div className="monthly-report">
      <h2>Monthly Breakdown - {year}</h2>
      
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="chart-container">
          <div className="bar-chart">
            {months.map((month, idx) => (
              <div key={month} className="bar-item">
                <div className="bar-wrapper">
                  <div 
                    className="bar" 
                    style={{ 
                      height: `${(monthTotals[idx] / maxTotal) * 200}px` 
                    }}
                  ></div>
                </div>
                <p className="bar-label">{month}</p>
                <p className="bar-value">₹{monthTotals[idx].toFixed(0)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyReport;