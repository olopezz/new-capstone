import React from "react";
import { Link } from "react-router-dom";

function Sidebar({ isOpen, toggleSidebar }) {
  // Style for the sidebar container
  const sidebarStyle = {
    position: "fixed",
    top: 0,
    left: isOpen ? 0 : "-250px", // Show/Hide sidebar
    width: "250px",
    height: "100%",
    backgroundColor: "#111",
    overflowX: "hidden", // Hide horizontal scroll
    transition: "left 0.3s ease", // Smooth transition for sidebar
    paddingTop: "60px", // Space for top content
    zIndex: 20, // Make sure sidebar is on top
  };

  return (
    <div style={sidebarStyle}>
      <Link to="/" onClick={toggleSidebar} style={linkStyle}>
        Home
      </Link>
      <Link to="/products" onClick={toggleSidebar} style={linkStyle}>
        Products
      </Link>
      <Link to="/community" onClick={toggleSidebar} style={linkStyle}>
        Community
      </Link>{" "}
      {/* Add Community Page link here */}
      <Link to="/admin" onClick={toggleSidebar} style={linkStyle}>
        Admin
      </Link>
      <Link to="/login" onClick={toggleSidebar} style={linkStyle}>
        Login/Register
      </Link>
      {/* Add more links or adjust as needed */}
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
}

const linkStyle = {
  padding: "10px 15px",
  textDecoration: "none",
  color: "white",
  display: "block",
  transition: "0.3s",
};

const handleLogout = () => {
  // Clear the token from localStorage
  localStorage.removeItem("token");

  // Redirect to the login page
  window.location.href = "/login";
};

export default Sidebar;
