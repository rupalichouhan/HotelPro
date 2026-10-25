import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8001/api',
});

// Interceptor to attach auth-token from localStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['auth-token'] = token;
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
