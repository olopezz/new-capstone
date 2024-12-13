import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

const PageWrapper = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isHomePage = location.pathname === "/";

  return (
    <>
      {!isHomePage && (
        <button onClick={toggleSidebar} style={buttonStyle}>
          &#9776;
        </button>
      )}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      {isHomePage && <Header />}
      <div style={{ paddingTop: isHomePage ? "0" : "60px", minHeight: "80vh" }}>
        {children}
      </div>
    </>
  );
};

const buttonStyle = {
  fontSize: "30px",
  cursor: "pointer",
  position: "absolute",
  top: "10px",
  left: "10px",
  zIndex: 100,
};

export default PageWrapper;
