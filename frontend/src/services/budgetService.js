import api from './api';

export const budgetService = {
  create: (data) => api.post('/budgets', data),
  getById: (id) => api.get(`/budgets/${id}`),
  getAll: () => api.get('/budgets'),
  update: (id, data) => api.put(`/budgets/${id}`, data),
  delete: (id) => api.delete(`/budgets/${id}`),
  getUtilization: (id) => api.get(`/budgets/${id}/utilization`),
};
