import React from "react";
import { FaHome, FaInfoCircle, FaUsers, FaCalendarAlt, FaEnvelope } from "react-icons/fa";
import "./Home.css";
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

  return (
    <div className="home-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Society Portal</h2>
        <ul>
          <li><a href="/home"><FaHome /> Dashboard</a></li>
          <li><a href="/about"><FaInfoCircle /> About</a></li>
          <li><a href="/members"><FaUsers /> Members</a></li>
          <li><a href="/events"><FaCalendarAlt /> Events</a></li>
          <li><a href="/contact"><FaEnvelope /> Contact</a></li>
        </ul>
        <button onClick={handleLogout} className="btn btn-danger mt-3">
           LOGOUT
        </button>
        
      </div>


      {/* Main content */}
      <div className="main-content">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <h1>Welcome to Purbachal Society</h1>
          <p>Logged in as: <b>Member</b></p>
        </div>

        {/* Notice Board */}
        <div className="card notice-board">
          <h3>Notice Board</h3>
          <ul>
            <li>Annual General Meeting on 15th September</li>
            <li>Maintenance fees due by end of the month</li>
            <li>Playground renovation work starts next week</li>
          </ul>
        </div>


        {/* Membership Status */}
        <div className="card">
          <h3>Membership Status</h3>
          <p className="status">✅ Active Member</p>
          <p>Valid until: 31st December 2025</p>
        </div>

        {/* Quick Links */}
        <div className="card">
          <h3>Quick Links</h3>
          <div className="quick-links">
            <div className="link-card">Society Rules</div>
            <div className="link-card">Payment Portal</div>
            <div className="link-card">Events Calendar</div>
            <div className="link-card">Gallery</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

