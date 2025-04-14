import React from "react";
import "./ReviewEvents.css";

const ReviewEvents = () => {
  return (
    <div className="review-events container-fluid">
      <h2 className="mb-4">Review Events</h2>
      <p>Approve or reject event submissions:</p>

      <ul className="list-group">
        <li className="list-group-item d-flex justify-content-between align-items-center">
          Event A - Pending Approval
          <div>
            <button className="btn btn-success btn-sm me-2">Approve</button>
            <button className="btn btn-danger btn-sm">Reject</button>
          </div>
        </li>
        <li className="list-group-item d-flex justify-content-between align-items-center">
          Event B - Pending Approval
          <div>
            <button className="btn btn-success btn-sm me-2">Approve</button>
            <button className="btn btn-danger btn-sm">Reject</button>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default ReviewEvents;
