import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user && user.access) {
        config.headers['Authorization'] = `Bearer ${user.access}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
