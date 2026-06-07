import { apiClient } from './apiClient';

export const getCart = async () => {
  const response = await apiClient.get('/cart/');
  return response.data;
};

export const addToCart = async (payload) => {
  const response = await apiClient.post('/cart/add/', payload);
  return response.data;
};

export const updateCartItem = async (payload) => {
  const { item_id, quantity } = payload;
  const response = await apiClient.patch(`/cart/item/${item_id}/`, { quantity });
  return response.data;
};

export const removeCartItem = async (payload) => {
  const { item_id } = payload;
  const response = await apiClient.delete(`/cart/item/${item_id}/remove/`);
  return response.data;
};

export const clearCart = async () => {
  const response = await apiClient.delete('/cart/clear/');
  return response.data;
};
