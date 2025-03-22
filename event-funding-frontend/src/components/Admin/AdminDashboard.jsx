import React from "react";
import Sidebar from "./Sidebar";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="content flex-grow-1 p-4">
        {/* <h1>Welcome to Admin Dashboard</h1>
        <p>Manage volunteers, events, and more from here.</p> */}
      </div>
    </div>
  );
};

export default AdminDashboard;
