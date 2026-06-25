import React from 'react';
import { Outlet } from 'react-router-dom';
import './layouts.scss';

const MinimalLayout = () => {
  return (
    <div className="layout-wrapper minimal-layout">
      <main className="minimal-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MinimalLayout;
