import React, { useEffect, useState } from "react";
import { FaHome, FaInfoCircle, FaUsers, FaCalendarAlt, FaEnvelope, FaGavel } from "react-icons/fa";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import axios from "axios";

function Home() {
  const navigate = useNavigate();
  const { user, logout, isAdmin, isMember } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get("http://localhost:3001/notices");
        setNotices(response.data.notices || []);
      } catch (err) {
        console.error("Failed to fetch notices:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
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
          <li><a href="/society-rules"><FaGavel /> Society Rules</a></li>
          <li><a href="/contact"><FaEnvelope /> Contact</a></li>
          {isAdmin && (
            <li><a href="/admin">Admin</a></li>
          )}
        </ul>
        <button onClick={handleLogout} className="logout-btn">
          LOGOUT
        </button>
      </div>

      {/* Main content */}
      <div className="main-content">
        <div className="dashboard-header">
          <h1>Welcome to Purbachal NewTown Society</h1>
          <div className="user-role">
            {user?.role || 'visitor'}
          </div>
        </div>

        <div className="card notice-board">
          <h3>Notice Board</h3>
          {loading ? (
            <p>Loading notices...</p>
          ) : notices.length > 0 ? (
            <ul>
              {notices.map(notice => (
                <li key={notice.id}>
                  <strong>{notice.title}</strong>
                  <br />
                  {notice.body}
                  <br />
                  <small style={{ color: '#666' }}>
                    {'Posted At: '}{new Date(notice.createdAt).toLocaleDateString()}
                  </small>
                </li>
              ))}
            </ul>
          ) : (
            <p>No notices posted yet.</p>
          )}
        </div>

        <div className="card">
          <h3>Membership Status</h3>
          {user ? (
            <>
              <div className="status">
                <span className={`status-badge ${
                  user.membershipStatus === 'active' ? 'status-active' :
                  user.membershipStatus === 'pending' ? 'status-pending' :
                  user.membershipStatus === 'none' ? 'status-none' :
                  'status-removed'
                }`}>
                  {user.membershipStatus === 'active' && 'Active Member'}
                  {user.membershipStatus === 'pending' && 'Pending Approval'}
                  {user.membershipStatus === 'none' && 'Not a Member'}
                  {user.membershipStatus === 'removed' && 'Membership Removed'}
                </span>
              </div>
              <p>Role: <b>{user.role}</b></p>
              {user.membershipStatus === 'active' && (
                <p>Valid until: 31st December 2025</p>
              )}
            </>
          ) : (
            <p>Loading membership status...</p>
          )}
        </div>

        <div className="card">
          <h3>Quick Links</h3>
          <div className="quick-links">
            <div className="link-card" onClick={() => navigate('/society-rules')}>Society Rules</div>
            <div className="link-card">Payment Portal</div>
            <div className="link-card" onClick={() => navigate('/events')}>Events Calendar</div>
            <div className="link-card" onClick={() => navigate('/apply-membership')}>Membership Form</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
