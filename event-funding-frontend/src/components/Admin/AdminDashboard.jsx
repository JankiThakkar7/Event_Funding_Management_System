import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import ManageVolunteers from "./ManageVolunteers";
import ReviewEvents from "./ReviewEvents";
import EventsDataAnalytics from "./EventsDataAnalytics";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="content flex-grow-1 p-4">
        <Routes>
          {/* Default Route: Redirect to Dashboard */}
          <Route path="/" element={<Navigate to="/admin/dashboard" />} />
          
          <Route
            path="dashboard"
            element={
              <div>
                <h1>Welcome to Admin Dashboard</h1>
                <p>Manage volunteers, events, and more from here.</p>
                <div className="overview">
                  <div className="card">Total Volunteers: 120</div>
                  <div className="card">Pending Events: 15</div>
                  <div className="card">Approved Events: 30</div>
                </div>
              </div>
            }
          />
          <Route path="volunteers" element={<ManageVolunteers />} />
          <Route path="events" element={<ReviewEvents />} />
          <Route path="analytics" element={<EventsDataAnalytics />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
