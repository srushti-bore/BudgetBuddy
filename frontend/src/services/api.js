import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 300000, // 5 min timeout (300,000ms) to comfortably allow Render container boot & Spring Boot DB connection
});

api.interceptors.response.use(
  (response) => {
    // If backend returns HTML (e.g. static fallback when VITE_API_BASE_URL is not set on Vercel)
    if (typeof response.data === 'string' && response.data.trim().startsWith('<!doctype')) {
      return Promise.reject({
        message: 'Backend server is not connected. Please verify VITE_API_BASE_URL in your Vercel project settings.',
        status: 503,
      });
    }
    return response.data;
  },
  (error) => {
    let msg = error.response?.data?.message || error.message || 'Unable to connect to backend server';
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      msg = 'Backend server is starting up (Render Free Tier cold start). Please wait a moment...';
    }
    const customError = {
      message: msg,
      status: error.response?.status,
      data: error.response?.data,
    };
    return Promise.reject(customError);
  }
);

export default api;
