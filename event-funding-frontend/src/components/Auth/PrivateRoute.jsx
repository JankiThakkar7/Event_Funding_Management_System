import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element, role }) => {
  const accessToken = localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("role");

  // If there's no access token, redirect to login page
  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  // If the user's role doesn't match the required role, redirect to homepage
  if (userRole !== role) {
    return <Navigate to="/" />;
  }

  // If everything is fine, render the protected element
  return element;
};

export default PrivateRoute;
