import React from "react";
import { Link } from "react-router-dom";
import { FaUsers, FaCalendarCheck, FaCog, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="d-flex flex-column flex-shrink-0 p-3 bg-dark sidebar">
      <h3 className="text-white text-center mb-4">Admin Panel</h3>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="/admin" className="nav-link text-white">
            <FaTachometerAlt className="me-2" /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/volunteers" className="nav-link text-white">
            <FaUsers className="me-2" /> Manage Volunteers
          </Link>
        </li>
        <li>
          <Link to="/admin/events" className="nav-link text-white">
            <FaCalendarCheck className="me-2" /> Review Events
          </Link>
        </li>
        <li>
          <Link to="/admin/settings" className="nav-link text-white">
            <FaCog className="me-2" /> Settings
          </Link>
        </li>
      </ul>
      <button className="btn btn-danger mt-auto w-100">
        <FaSignOutAlt className="me-2" /> Logout
      </button>
    </div>
  );
};

export default Sidebar;
