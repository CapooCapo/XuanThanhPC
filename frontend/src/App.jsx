import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { ToastProvider } from '@/contexts/ToastContext';
import Home from '@/pages/home/Home';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import BuildPCPage from '@/pages/build-pc/BuildPCPage';

import PCComponentsPage from '@/pages/pc-components/PCComponentsPage';
import GamingPage from '@/pages/gaming/GamingPage';
import ContactPage from '@/pages/contact/ContactPage';
import ProductDetailPage from '@/pages/products/ProductDetailPage';
import CartPage from '@/pages/cart/CartPage';
import CheckoutPage from '@/pages/checkout/CheckoutPage';

import AdminRoutes from '@/pages/admin/routes/AdminRoutes';

import '@/styles/global.scss';

import SupportWidget from '@/components/common/support/SupportWidget';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) return <div>Loading...</div>;
  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CartProvider>
          <Router>
            <Routes>
            {/* Admin Routes - Loaded separately to avoid frontend layout wrapper */}
            <Route path="/dashboard/admin/*" element={<AdminRoutes />} />
            
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/build-pc" element={<BuildPCPage />} />
            <Route path="/buildpc" element={<Navigate to="/build-pc" replace />} />
            
            {/* Ecommerce Pages */}
            <Route path="/linh-kien-pc" element={<PCComponentsPage />} />
            <Route path="/gaming" element={<GamingPage />} />
            <Route path="/lien-he" element={<ContactPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <div>Profile Page (Protected)</div>
              </ProtectedRoute>
            } />
          </Routes>
          <SupportWidget />
        </Router>
      </CartProvider>
    </ToastProvider>
  </AuthProvider>
  );
}

export default App;
