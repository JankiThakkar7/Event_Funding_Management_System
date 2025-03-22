import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element, role }) => {
  const accessToken = localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("role");

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  if (userRole !== role) {
    return <Navigate to="/" />;
  }

  return element;
};

export default PrivateRoute;
