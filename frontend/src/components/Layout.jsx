import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-main">
        <Navbar />
        <div className="app-content">
          <div className="fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
