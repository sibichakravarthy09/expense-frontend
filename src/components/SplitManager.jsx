import React, { useState, useEffect } from 'react';
import { splitApi } from '../services/api';
import './SplitManager.css';

const SplitManager = ({ onSplitUpdated }) => {
  const [splits, setSplits] = useState([]);
  const [newSplit, setNewSplit] = useState({ name: '', color: '#3498db' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSplits();
  }, []);

  const fetchSplits = async () => {
    try {
      setLoading(true);
      const res = await splitApi.getAll();
      setSplits(res.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch splits');
      setSplits([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSplit = async (e) => {
    e.preventDefault();
    if (!newSplit.name.trim()) {
      setError('Split name is required');
      return;
    }

    try {
      setLoading(true);
      await splitApi.create(newSplit);
      setSuccess('Split created successfully!');
      setNewSplit({ name: '', color: '#3498db' });
      fetchSplits();
      onSplitUpdated?.();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create split');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSplit = async (id) => {
    if (window.confirm('Are you sure you want to delete this split?')) {
      try {
        await splitApi.delete(id);
        setSuccess('Split deleted successfully!');
        fetchSplits();
        onSplitUpdated?.();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete split');
      }
    }
  };

  return (
    <div className="split-manager">
      <h2>Manage Split Categories</h2>
      
      {error && <div className="error-msg">{error}</div>}
      {success && <div className="success-msg">{success}</div>}

      <form onSubmit={handleAddSplit} className="split-form">
        <div className="form-group">
          <label>Split Name</label>
          <input
            type="text"
            value={newSplit.name}
            onChange={(e) => setNewSplit({ ...newSplit, name: e.target.value })}
            placeholder="e.g., Home, Office, Roommates"
          />
        </div>

        <div className="form-group">
          <label>Color</label>
          <div className="color-input">
            <input
              type="color"
              value={newSplit.color}
              onChange={(e) => setNewSplit({ ...newSplit, color: e.target.value })}
            />
            <span style={{ backgroundColor: newSplit.color }}></span>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Split'}
        </button>
      </form>

      <div className="splits-list">
        <h3>Your Splits</h3>
        {loading && <p>Loading...</p>}
        {splits.length === 0 && !loading && <p>No splits created yet</p>}
        {splits.length > 0 && (
          <div className="splits-grid">
            {splits.map(split => (
              <div key={split._id} className="split-card">
                <div 
                  className="split-color" 
                  style={{ backgroundColor: split.color || '#667eea' }}
                ></div>
                <div className="split-info">
                  <h4>{split.name}</h4>
                </div>
                <button 
                  onClick={() => handleDeleteSplit(split._id)}
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SplitManager;
