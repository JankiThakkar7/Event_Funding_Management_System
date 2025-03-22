import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");

    if (accessToken) {
      // Redirect based on role
      if (role === "organization") {
        navigate("/admin/dashboard");
      } else if (role === "user") {
        navigate("/user/dashboard");
      }
    }
  }, [navigate]);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <header className="hero">
        <h1>Welcome to EventFunding!</h1>
        <p>Empowering communities by connecting events and donations.</p>
        <button className="btn btn-success">
          <Link to="/register">Get Started</Link>
        </button>
      </header>

      {/* Features Section */}
      <section id="features" className="features">
        <h2>Our Features</h2>
        <div className="feature-cards">
          <div className="card">
            <h3>User Roles & Authentication</h3>
            <p>Secure registration for Organizations, Volunteers, and Event Visitors.</p>
          </div>
          <div className="card">
            <h3>Event Management</h3>
            <p>Create and manage events with admin approval for security.</p>
          </div>
          <div className="card">
            <h3>Event Participation</h3>
            <p>Book seats, donate, and participate in events seamlessly.</p>
          </div>
          <div className="card">
            <h3>Payment & Donations</h3>
            <p>Secure payments and donations via Stripe/PayPal integration.</p>
          </div>
          <div className="card">
            <h3>Security Features</h3>
            <p>Role-based access control and fraud prevention measures.</p>
          </div>
          <div className="card">
            <h3>Additional Features</h3>
            <p>Notifications, Reviews, Filtering, and Dashboard Analytics.</p>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="about">
        <h2>About Us</h2>
        <p>
          The Event Funding Management Platform is designed to facilitate event organization and fundraising. 
          We empower communities by connecting events and donations, providing a seamless user experience 
          for both organizations and event attendees.
        </p>
      </section>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} EventFunding. All rights reserved.</p>
      </footer>
    </>
  );
};

export default Home;
