import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import AdminLayout from '../layouts/AdminLayout';
import LoginPage from '@/pages/admin/pages/LoginPage';
import DashboardPage from '@/pages/admin/pages/DashboardPage';
import ProductListPage from '@/pages/admin/pages/products/ProductListPage';
import CategoryPage from '@/pages/admin/pages/categories/CategoryPage';
import OrderListPage from '@/pages/admin/pages/orders/OrderListPage';
import UserListPage from '@/pages/admin/pages/users/UserListPage';
import SupportChatPage from '@/pages/admin/pages/support/SupportChatPage';
import AnalyticsPage from '@/pages/admin/pages/analytics/AnalyticsPage';
import { ToastProvider } from '@/contexts/ToastContext';

// Placeholder components for incomplete pages to ensure routing works
const PlaceholderPage = ({ title }) => (<div><h2>{title}</h2><p>Coming soon...</p></div>);

const AdminRoutes = () => {
  return (
    <AdminAuthProvider>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/orders" element={<OrderListPage />} />
          <Route path="/users" element={<UserListPage />} />
          <Route path="/support" element={<SupportChatPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
      </ToastProvider>
    </AdminAuthProvider>
  );
};

export default AdminRoutes;
