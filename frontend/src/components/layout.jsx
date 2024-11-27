// components/Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';

const Layout = () => {
  return (
    <div className="full-screen" style={{backgroundColor: "whitesmoke"}}>
      <Sidebar />
      <div className="contentContainer">
      <div className="contentCard">
        <Outlet /> {/* Render the active route content here */}
      </div>
      </div>
    </div>
  );
};

export default Layout;
