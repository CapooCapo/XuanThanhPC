import { apiClient } from './apiClient';

export const getProducts = async (params = {}) => {
  const response = await apiClient.get('/products/', { params });
  return response.data;
};

export const getCategories = async () => {
  const response = await apiClient.get('/categories/');
  return response.data;
};
