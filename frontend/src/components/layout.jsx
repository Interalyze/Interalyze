// components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';

const Layout = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 p-4">
        <Outlet /> {/* Render the active route content here */}
      </div>
    </div>
  );
};

export default Layout;
