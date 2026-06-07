import { apiClient } from './apiClient';

export const getOrders = async () => {
  const response = await apiClient.get('/orders/');
  return response.data;
};

export const checkout = async (payload) => {
  const response = await apiClient.post('/checkout/', payload);
  return response.data;
};

export const processPayment = async (payload) => {
  const response = await apiClient.post('/payments/', payload);
  return response.data;
};
