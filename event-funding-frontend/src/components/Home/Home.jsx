import React from "react";
import { motion } from "framer-motion";
import "./Home.css";
import Navbar from "../Navbar/Navbar";

const Home = () => {
  return (
    <div className="home">
      {/* Navbar */}
      {/* <nav className="navbar">
        <div className="logo">EVENTFUNDING</div>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#about">About Us</a></li>
          <li><a href="/login">Login</a></li>
          <li><a href="/register">Register</a></li>
        </ul>
      </nav> */}
      <Navbar />

      {/* Welcome Section */}
      <section className="hero full-screen" id="home">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1>Welcome to EventFunding!</h1>
          <p>Empowering communities by connecting events and donations.</p>
          <div className="cta-buttons">
            <a href="/register" className="btn-primary">Get Started</a>
            <a href="/login" className="btn-secondary">Login</a>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features full-screen" id="features">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>Our Features</h2>
          <div className="features-grid">
            <motion.div 
              className="feature-card"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h3>Create Events</h3>
              <p>Organize events and reach a wider audience effortlessly.</p>
            </motion.div>
            <motion.div 
              className="feature-card"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h3>Secure Donations</h3>
              <p>Receive and manage donations with transparency and ease.</p>
            </motion.div>
            <motion.div 
              className="feature-card"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <h3>Community Engagement</h3>
              <p>Connect with people passionate about your cause.</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* About Us Section */}
      <section className="about full-screen" id="about">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>About Us</h2>
          <p>EventFunding bridges the gap between event organizers and donors, creating meaningful connections and empowering communities.</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} EventFunding. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
