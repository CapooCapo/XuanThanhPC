import axios from 'axios';

const adminApi = axios.create({
  baseURL: '/api/admin/',
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export { adminApi };
export default adminApi;
