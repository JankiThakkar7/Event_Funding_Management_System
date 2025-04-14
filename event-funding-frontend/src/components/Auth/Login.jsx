import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    console.log("Submitting login form with: ", formData);
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        email: formData.email,
        password: formData.password,
      });
  
      console.log("Response received: ", response.data);
  
      // Correct field names based on response
      const { access_token, refresh_token, type } = response.data;
  
      if (!access_token || !type) {
        throw new Error("Invalid response from server");
      }
  
      // ✅ Store token and role in localStorage correctly
      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token || ""); // Optional if not provided
      localStorage.setItem("role", type); // "organization", "user", or "volunteer"
  
      alert("Login Successful!");
  
      // ✅ Correct role checking and navigation
      if (type === "organization") {
        navigate("/admin/dashboard"); // Redirect for organization
      } else if (type === "volunteer") {
        navigate("/volunteer/dashboard"); // Redirect for volunteer
      } else {
        navigate("/user/dashboard"); // Redirect for user
      }
    } catch (err) {
      console.error("Login error: ", err);
      if (err.response) {
        console.log("Error response data: ", err.response.data);
      }
      setError("Invalid email or password. Please try again.");
    }
  };
  
  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Login to EventFunding</h2>
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="login-btn">Login</button>

            <div className="form-links">
              <Link to="/forgot-password">Forgot Password?</Link>
              <span> | </span>
              <Link to="/register">Create an Account</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
