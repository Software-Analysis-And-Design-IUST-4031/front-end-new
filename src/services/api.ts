import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api';  // Adjust this to match your Django backend URL
export const MEDIA_URL = 'http://localhost:8000';  // Base URL for media files

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Request config:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data
  });
  
  if (token) {
    const finalToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    if (config.headers) {
      config.headers.Authorization = finalToken;
    } else {
      config.headers = { Authorization: finalToken };
    }
  }
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('Response data:', {
      status: response.status,
      headers: response.headers,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      config: error.config
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('userId');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
