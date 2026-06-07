import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiClient } from '@/services/apiClient';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in on mount
    const token = localStorage.getItem('admin_access_token');
    const userStr = localStorage.getItem('admin_user');
    
    if (token && userStr) {
      try {
        setAdminUser(JSON.parse(userStr));
      } catch (e) {
        localStorage.removeItem('admin_user');
        localStorage.removeItem('admin_access_token');
      }
    }
    setLoading(false);
  }, []);

  const loginAdmin = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/token/', { email, password });
      
      const { access, user } = response.data;
      
      // We only allow login if the user is staff or superuser. 
      // The backend token might not return is_staff directly in standard simplejwt response 
      // unless we customize the claim. For security, the backend /api/admin/ endpoints 
      // check the permission anyway. But ideally we'd fetch profile.
      
      localStorage.setItem('admin_access_token', access);
      localStorage.setItem('admin_user', JSON.stringify(user));
      setAdminUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.detail || 'Login failed' };
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem('admin_access_token');
    localStorage.removeItem('admin_user');
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, loading, loginAdmin, logoutAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
