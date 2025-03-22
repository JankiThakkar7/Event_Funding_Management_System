import React, { useState } from "react";
import axios from "axios";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/forgot-password/", { email });
      setMessage("A password reset link has been sent to your email address.");
    } catch (error) {
      setError("Error! Unable to send reset link. Please try again.");
    }
  };

  return (
    <div className="forgot-password-wrapper">
    <div className="forgot-password-container">
      <h2 className="forgot-password-title">Forgot Password</h2>
      <p className="forgot-password-description">
        Please enter your registered email address to receive a password reset link.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-btn">
          Send Reset Link
        </button>
      </form>

      {message && <p className="message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <a href="/login" className="back-link">
        Back to Login
      </a>
    </div>
    </div>
  );
};

export default ForgotPassword;
