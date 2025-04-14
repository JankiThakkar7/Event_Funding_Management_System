import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import "./VolunteerDashboard.css"; // Importing the CSS file

const VolunteerDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [redirectToNotifications, setRedirectToNotifications] = useState(false);

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

  // Handle redirection after login
  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      setRedirectToNotifications(true);
    }
  }, []);

  if (redirectToNotifications) {
    return <Redirect to="/volunteer/notifications" />;
  }

  return (
    <div className="volunteer-dashboard">
      <div className="container">
        <div className="row mt-4">
          <div className="col-md-3">
            <div className="sidebar">
              <h4>Volunteer Dashboard</h4>
              <ul className="nav flex-column">
                <li className="nav-item">
                  <Link to="/volunteer/dashboard" className="nav-link active">
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
                  <Link to="/volunteer/notifications" className="nav-link">
                    Notifications
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-9">
            <div className="content">
              {/* Notifications Section */}
              <div className="notifications-section">
                <h4>Notifications</h4>
                {loading ? (
                  <p>Loading...</p>
                ) : notifications.length > 0 ? (
                  <ul className="notification-list">
                    {notifications.map((notification) => (
                      <li
                        key={notification.id}
                        className={`notification-item ${
                          notification.read ? "read" : "unread"
                        }`}
                      >
                        <p>{notification.message}</p>
                        <small>
                          {new Date(notification.created_at).toLocaleString()}
                        </small>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No notifications available.</p>
                )}
              </div>

              {/* Recent Activities */}
              <div className="recent-activities">
                <h4>Recent Activities</h4>
                <ul>
                  <li>Event A - 10th April 2025 - Completed</li>
                  <li>Event B - 15th April 2025 - Upcoming</li>
                  <li>Event C - 18th April 2025 - Upcoming</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
