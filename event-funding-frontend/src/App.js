import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import AdminDashboard from "./components/Admin/AdminDashboard";
import UserDashboard from "./components/User/UserDashboard";
import VolunteerNotification from "./components/Volunteer/VolunteerNotification"; // Updated: Volunteer Notification Page
import PrivateRoute from "./components/Auth/PrivateRoute";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Private Routes */}
        <Route
          path="/admin/*"
          element={<PrivateRoute element={<AdminDashboard />} role="organization" />}
        />
        <Route
          path="/user/dashboard"
          element={<PrivateRoute element={<UserDashboard />} role="user" />}
        />
        <Route
          path="/volunteer/*"
          element={<PrivateRoute element={<VolunteerNotification />} role="volunteer" />}
        />

        {/* Redirect any unknown route to Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
