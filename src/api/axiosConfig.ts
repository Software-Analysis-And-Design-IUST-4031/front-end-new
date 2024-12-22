import axios from 'axios';

// For development, always use localhost
const baseURL = 'http://localhost:8000/api';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  }
});

const exemptRoutes = ['/user/login/', '/user/register/'];

axiosInstance.interceptors.request.use(
  (config) => {
    if (!exemptRoutes.includes(config.url || '')) {
      const token = localStorage.getItem('token');
      if (token) {
        // Ensure headers object exists
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    console.log('Request:', config);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', response);
    return response;
  },
  (error) => {
    console.error('Response Error:', error);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      // Optionally, redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;