import { apiClient } from './apiClient';
import { logger } from '@/utils/logger';

export const getProducts = async (params = {}) => {
  try {
    const response = await apiClient.get('/products/', { params });
    // Ensure we always return an array
    if (!response.data || !Array.isArray(response.data)) {
      logger.warn('productService', 'API returned non-array products data', response.data);
      return [];
    }
    return response.data;
  } catch (error) {
    logger.error('productService', 'Failed to fetch products', error);
    return [];
  }
};

export const getCategories = async () => {
  try {
    const response = await apiClient.get('/categories/');
    if (!response.data || !Array.isArray(response.data)) {
      logger.warn('productService', 'API returned non-array categories data', response.data);
      return [];
    }
    return response.data;
  } catch (error) {
    logger.error('productService', 'Failed to fetch categories', error);
    return [];
  }
};
