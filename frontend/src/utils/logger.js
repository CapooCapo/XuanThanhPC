/**
 * Development-only logger for capturing runtime errors, API failures,
 * and missing data safely without cluttering production.
 */

const isDevelopment = import.meta.env.MODE === 'development';

export const logger = {
  error: (context, error, data = null) => {
    if (isDevelopment) {
      console.error(`[ERROR] ${context}:`, error);
      if (data) {
        console.error('Data context:', data);
      }
    }
  },
  
  warn: (context, message, data = null) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${context}:`, message);
      if (data) {
        console.warn('Data context:', data);
      }
    }
  },

  info: (context, message, data = null) => {
    if (isDevelopment) {
      console.info(`[INFO] ${context}:`, message);
      if (data) {
        console.info('Data context:', data);
      }
    }
  }
};
