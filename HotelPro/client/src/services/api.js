import axios from 'axios';

// Sanitize the API Base URL to safely handle Markdown links like [url](url) or missing /api
const getBaseUrl = () => {
  let url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api';
  
  if (typeof url === 'string') {
    // If copied as markdown link like [https://...](https://...)
    const markdownMatch = url.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (markdownMatch) {
      url = markdownMatch[2];
    } else {
      url = url.replace(/^[\[\(]/, '').replace(/[\]\)]$/, '').trim();
    }
    // Remove trailing slash
    url = url.replace(/\/+$/, '');
    // Ensure /api suffix
    if (!url.endsWith('/api')) {
      url = `${url}/api`;
    }
  }
  return url;
};

const API = axios.create({
  baseURL: getBaseUrl(),
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
