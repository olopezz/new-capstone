import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const isNotHomePage = location.pathname !== '/';

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {isNotHomePage && (
        <button onClick={toggleSidebar} style={{
          fontSize: '30px', cursor: 'pointer', position: 'absolute', top: '10px', left: '10px', zIndex: '100'
        }}>&#9776;</button>
      )}

      {isSidebarOpen && <Sidebar toggleSidebar={toggleSidebar} />}

      {location.pathname === '/' && <Header />}

      {children}
    </>
  );
};

export default Layout;

