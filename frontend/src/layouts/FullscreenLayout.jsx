import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './components/Header/Header';
import './layouts.scss';

const FullscreenLayout = () => {
  return (
    <div className="layout-wrapper fullscreen-layout">
      <Header />
      <main className="fullscreen-content">
        <Outlet />
      </main>
    </div>
  );
};

export default FullscreenLayout;
