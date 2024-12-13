import React from "react";
import { Link } from "react-router-dom";

function Header({ show }) {
  // Conditional styling based on the 'show' prop.
  const headerStyle = {
    backgroundColor: "#f8f9fa",
    padding: "10px 20px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    position: "absolute",
    top: "0",
    width: "100%",
    zIndex: 5,
    transform: show ? "translateY(0)" : "translateY(-100%)",
    transition: "transform 0.3s ease",
  };

  return (
    <header style={headerStyle}>
      <nav>
        <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
          <li style={{ display: "inline", marginRight: "20px" }}>
            <Link to="/" style={{ textDecoration: "none", color: "black" }}>
              Home
            </Link>
          </li>
          <li style={{ display: "inline", marginRight: "20px" }}>
            <Link
              to="/products"
              style={{ textDecoration: "none", color: "black" }}
            >
              Products
            </Link>
          </li>
          <li style={{ display: "inline", marginRight: "20px" }}>
            <Link
              to="/community"
              style={{ textDecoration: "none", color: "black" }}
            >
              Community
            </Link>
          </li>{" "}
          {/* Added Community link here */}
          <li style={{ display: "inline", marginRight: "20px" }}>
            <Link
              to="/admin"
              style={{ textDecoration: "none", color: "black" }}
            >
              Admin
            </Link>
          </li>
          <li style={{ display: "inline" }}>
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "black" }}
            >
              Login/Register
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
