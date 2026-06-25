import React from 'react';
import { Outlet } from 'react-router-dom';
import './layouts.scss';

const AdminLayout = ({ children }) => {
  return (
    <div className="layout-wrapper admin-layout">
      {/* Admin layout typically handles its own header/sidebar within AdminRoutes */}
      <main className="admin-content">
        {children ? children : <Outlet />}
      </main>
    </div>
  );
};

export default AdminLayout;
