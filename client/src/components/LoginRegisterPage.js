import React, { useState } from "react";
import "./LoginRegisterPage.css";
import Sidebar from "./Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginRegisterPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [feedback, setFeedback] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Reset feedback
    setFeedback("");

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setFeedback("Passwords do not match.");
      return;
    }

    try {
      const endpoint = isLogin ? "/api/users/login" : "/api/users/register";

      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
          };

      const { data } = await axios.post(endpoint, payload);

      // Save token and user name to localStorage
      localStorage.setItem("token", data.token);
      if (!isLogin) {
        localStorage.setItem("userName", data.userName); // Save user name during registration
      } else {
        localStorage.setItem("userName", data.userName || "User"); // Save user name during login
      }

      // Navigate to the main page or dashboard
      navigate("/products");

      setFeedback("Success! Redirecting...");
    } catch (error) {
      setFeedback(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <>
      {isSidebarOpen && (
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      )}
      <button
        onClick={toggleSidebar}
        style={{
          fontSize: "30px",
          cursor: "pointer",
          position: "absolute",
          top: "10px",
          left: "10px",
        }}
      >
        &#9776;
      </button>

      <div className="login-register-container">
        <div className="login-register-form">
          <h1>{isLogin ? "Login" : "Register"}</h1>
          {feedback && <div className="feedback-message">{feedback}</div>}
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            {!isLogin && (
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            )}
            <button type="submit" className="form-button">
              {isLogin ? "Login" : "Register"}
            </button>
          </form>
          <button onClick={() => setIsLogin(!isLogin)} className="toggle-btn">
            {isLogin
              ? "Need an account? Register"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </>
  );
}

export default LoginRegisterPage;
