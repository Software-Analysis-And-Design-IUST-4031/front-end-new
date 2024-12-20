import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL || 'http://127.0.0.1:8000/api',
});

// Automatically include the token if it exists
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Token ${token}`;
}

export default api;