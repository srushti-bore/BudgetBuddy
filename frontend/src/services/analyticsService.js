import api from './api';

export const analyticsService = {
  getSummary: () => api.get('/analytics/summary'),
  getCategoryBreakdown: () => api.get('/analytics/category'),
  getMonthlyReports: () => api.get('/analytics/monthly'),
};
