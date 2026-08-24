import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60s timeout to allow Render free tier cold starts (~30s) to finish waking up
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
      msg = 'Backend is taking a moment to wake up (Render Free Tier cold start). Please retry in a few seconds.';
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
