import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./VolunteerNotification.css"; // Importing the CSS file

const VolunteerNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications for the volunteer
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/volunteer/notifications/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Assuming you are using JWT token for auth
          },
        });
        setNotifications(response.data.notifications);
      } catch (error) {
        console.error("Error fetching notifications", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="volunteer-notification">
      <div className="container">
        <div className="row mt-4">
          <div className="col-md-3">
            <div className="sidebar">
              <h4>Volunteer Dashboard</h4>
              <ul className="nav flex-column">
                <li className="nav-item">
                  <Link to="/volunteer/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/volunteer/events" className="nav-link">
                    My Events
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/volunteer/profile" className="nav-link">
                    My Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/volunteer/notifications" className="nav-link active">
                    Notifications
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="col-md-9">
            <div className="content">
              <h2>Notifications</h2>
              {loading ? (
                <p>Loading...</p>
              ) : notifications.length > 0 ? (
                <ul className="notification-list">
                  {notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className={`notification-item ${notification.read ? "read" : "unread"}`}
                    >
                      <p>{notification.message}</p>
                      <small>{new Date(notification.created_at).toLocaleString()}</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No notifications available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerNotification;
