import React from 'react';
import { Outlet, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import '@/pages/admin/styles/admin.scss';

const AdminLayout = () => {
  const { adminUser, loading, logoutAdmin } = useAdminAuth();
  const navigate = useNavigate();

  if (loading) return <div>Loading Admin...</div>;
  if (!adminUser) return <Navigate to="/dashboard/admin/login" />;

  const handleLogout = () => {
    logoutAdmin();
    navigate('/dashboard/admin/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          Admin Dashboard
        </div>
        <ul className="nav-links">
          <li><NavLink to="/dashboard/admin/dashboard" end>Overview</NavLink></li>
          <li><NavLink to="/dashboard/admin/products">Products</NavLink></li>
          <li><NavLink to="/dashboard/admin/categories">Categories</NavLink></li>
          <li><NavLink to="/dashboard/admin/orders">Orders</NavLink></li>
          <li><NavLink to="/dashboard/admin/users">Users</NavLink></li>
          <li><NavLink to="/dashboard/admin/support">Support Chat</NavLink></li>
          <li><NavLink to="/dashboard/admin/analytics">Analytics</NavLink></li>
        </ul>
      </aside>
      
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="user-info">
            <span>Welcome, {adminUser.full_name || adminUser.email}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </header>
        
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
