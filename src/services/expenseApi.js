import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://expense-backend-72jp.onrender.com/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

const expenseApi = {
  getAll: (params) => axios.get(`${API_BASE_URL}/expenses`, { 
    params,
    ...getAuthHeader()
  }),
  create: (data) => axios.post(`${API_BASE_URL}/expenses`, data, getAuthHeader()),
  delete: (id) => axios.delete(`${API_BASE_URL}/expenses/${id}`, getAuthHeader())
};

export default expenseApi;
