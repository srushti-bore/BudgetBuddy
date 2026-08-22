import api from './api';

export const expenseService = {
  create: (data) => api.post('/expenses', data),
  getById: (id) => api.get(`/expenses/${id}`),
  getAll: (params) => api.get('/expenses', { params }),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
  getSummary: () => api.get('/expenses/summary'),
};
