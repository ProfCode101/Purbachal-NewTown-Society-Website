import React from 'react';
import { FaBuilding, FaUsers, FaMapMarkerAlt, FaCalendarAlt, FaAward, FaHome, FaInfoCircle, FaEnvelope, FaSignInAlt, FaUserPlus, FaGavel } from 'react-icons/fa';
import { useAuth } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function About() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/about", { replace: true });
  };

  return (
    <div className="home-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>Society Portal</h2>
        <ul>
          <li><a href="/about"><FaInfoCircle /> About</a></li>
          <li><a href="/contact"><FaEnvelope /> Contact</a></li>
          {user ? (
            <>
              <li><a href="/home"><FaHome /> Dashboard</a></li>
              <li><a href="/members"><FaUsers /> Members</a></li>
              <li><a href="/events"><FaCalendarAlt /> Events</a></li>
              <li><a href="/society-rules"><FaGavel /> Society Rules</a></li>
              <button onClick={handleLogout} className="logout-btn">
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <li><a href="/login"><FaSignInAlt /> Login</a></li>
              <li><a href="/register"><FaUserPlus /> Register</a></li>
            </>
          )}
        </ul>
      </div>

      {/* Main content */}
      <div className="main-content">
      <div className="dashboard-header">
        <h1>About Purbachal NewTown Society</h1>
      </div>

      <div className="card">
        <h3><FaBuilding /> Our Vision</h3>
        <p>Purbachal NewTown Society is dedicated to creating a thriving, sustainable community that brings together residents, property owners, and stakeholders in the beautiful Purbachal area. We envision a modern, well-planned township that serves as a model for urban development in Bangladesh.</p>
      </div>

      <div className="card">
        <h3><FaUsers /> Our Mission</h3>
        <p>To foster a sense of community, promote sustainable development, and ensure the highest standards of living for all residents. We work collaboratively with developers, government agencies, and community members to create a vibrant, inclusive neighborhood.</p>
      </div>

      <div className="card">
        <h3><FaMapMarkerAlt /> Location & Development</h3>
        <p>Located in the heart of Dhaka's eastern expansion, Purbachal NewTown spans over 6,000 acres of prime real estate. The development includes residential areas, commercial zones, educational institutions, healthcare facilities, and extensive green spaces.</p>
      </div>

      <div className="card">
        <h3><FaAward /> Key Features</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#d69e2e' }}>🏠</span> Modern residential complexes with world-class amenities
          </li>
          <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#d69e2e' }}>🌳</span> Extensive green spaces and parks
          </li>
          <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#d69e2e' }}>🏫</span> Educational institutions and healthcare facilities
          </li>
          <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#d69e2e' }}>🛣️</span> Well-planned road network and infrastructure
          </li>
          <li style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#d69e2e' }}>🏢</span> Commercial and business districts
          </li>
        </ul>
      </div>

      <div className="card">
        <h3><FaCalendarAlt /> Development Timeline</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '0.5rem', borderLeft: '4px solid #d69e2e' }}>
            <h4 style={{ color: '#1a365d', marginBottom: '0.5rem' }}>Phase 1 (2010-2015)</h4>
            <p style={{ fontSize: '0.9rem', color: '#4a5568' }}>Initial planning and infrastructure development</p>
          </div>
          <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '0.5rem', borderLeft: '4px solid #2d5a87' }}>
            <h4 style={{ color: '#1a365d', marginBottom: '0.5rem' }}>Phase 2 (2015-2020)</h4>
            <p style={{ fontSize: '0.9rem', color: '#4a5568' }}>Residential and commercial construction</p>
          </div>
          <div style={{ padding: '1rem', background: '#f7fafc', borderRadius: '0.5rem', borderLeft: '4px solid #e53e3e' }}>
            <h4 style={{ color: '#1a365d', marginBottom: '0.5rem' }}>Phase 3 (2020-Present)</h4>
            <p style={{ fontSize: '0.9rem', color: '#4a5568' }}>Community establishment and growth</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}