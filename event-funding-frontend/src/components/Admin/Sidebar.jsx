import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaUsers,
  FaCalendarCheck,
  FaChartBar,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUserCircle,
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-dark sidebar">
      <div className="profile-section text-center mb-4">
        <FaUserCircle className="profile-icon" />
        <h4 className="text-white mt-2">Admin</h4>
      </div>

      <h3 className="text-white text-center mb-4">Admin Panel</h3>

      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link
            to="/admin/dashboard"
            className={`nav-link ${
              currentPath === "/admin/dashboard" || currentPath === "/admin" ? "active" : "text-white"
            }`}
          >
            <FaTachometerAlt className="me-2" /> Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/admin/volunteers"
            className={`nav-link ${
              currentPath === "/admin/volunteers" ? "active" : "text-white"
            }`}
          >
            <FaUsers className="me-2" /> Manage Volunteers
          </Link>
        </li>
        <li>
          <Link
            to="/admin/events"
            className={`nav-link ${
              currentPath === "/admin/events" ? "active" : "text-white"
            }`}
          >
            <FaCalendarCheck className="me-2" /> Review Events
          </Link>
        </li>
        <li>
          <Link
            to="/admin/analytics"
            className={`nav-link ${
              currentPath === "/admin/analytics" ? "active" : "text-white"
            }`}
          >
            <FaChartBar className="me-2" /> Events Data Analytics
          </Link>
        </li>
      </ul>

      <button className="btn btn-danger mt-auto w-100 logout-btn">
        <FaSignOutAlt className="me-2" /> Logout
      </button>
    </div>
  );
};

export default Sidebar;
