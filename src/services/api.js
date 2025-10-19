import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me')
};

// Split API calls
export const splitApi = {
  getAll: () => api.get('/splits'),
  getById: (id) => api.get(`/splits/${id}`),
  create: (data) => api.post('/splits', data),
  update: (id, data) => api.put(`/splits/${id}`, data),
  delete: (id) => api.delete(`/splits/${id}`)
};
export const incomeApi = {
  getAll: () => api.get('/income'),
  create: (data) => api.post('/income', data),
  delete: (id) => api.delete(`/income/${id}`)
};

// Expense API calls
export const expenseApi = {
  getAll: (params) => api.get('/expenses', { params }),
  getById: (id) => api.get(`/expenses/${id}`),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
  getBySplit: (splitId) => api.get(`/expenses/split/${splitId}`)
};

// Stats API calls
export const statsApi = {
  getSummary: (params) => api.get('/stats/summary', { params }),
  getMonthly: (params) => api.get('/stats/monthly', { params }),
  getDaily: (params) => api.get('/stats/daily', { params }),
  getTop: (params) => api.get('/stats/top', { params })
};

export default api;