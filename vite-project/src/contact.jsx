import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaBuilding, FaUser, FaHome, FaInfoCircle, FaUsers, FaCalendarAlt, FaSignInAlt, FaUserPlus, FaGavel } from 'react-icons/fa';
import { useAuth } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Home.css';

export default function Contact() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real application, this would send the form data to the backend
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate("/contact", { replace: true });
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
        <h1>Contact Us</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          <div className="card">
            <h3><FaBuilding /> Society Office</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FaMapMarkerAlt style={{ color: '#2d5a87', fontSize: '1.2rem' }} />
                <div>
                  <p style={{ fontWeight: '600', margin: 0 }}>Address</p>
                  <p style={{ margin: 0, color: '#4a5568' }}>
                    Purbachal NewTown Society Office<br />
                    Block A, Road 1, Plot 5<br />
                    Purbachal, Dhaka 1230, Bangladesh
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FaPhone style={{ color: '#2d5a87', fontSize: '1.2rem' }} />
                <div>
                  <p style={{ fontWeight: '600', margin: 0 }}>Phone</p>
                  <p style={{ margin: 0, color: '#4a5568' }}>+880 1234 567890</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FaEnvelope style={{ color: '#2d5a87', fontSize: '1.2rem' }} />
                <div>
                  <p style={{ fontWeight: '600', margin: 0 }}>Email</p>
                  <p style={{ margin: 0, color: '#4a5568' }}>info@purbachalsociety.org</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FaClock style={{ color: '#2d5a87', fontSize: '1.2rem' }} />
                <div>
                  <p style={{ fontWeight: '600', margin: 0 }}>Office Hours</p>
                  <p style={{ margin: 0, color: '#4a5568' }}>
                    Sunday - Thursday: 9:00 AM - 5:00 PM<br />
                    Friday: 9:00 AM - 12:00 PM<br />
                    Saturday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Emergency Contacts</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: '#fed7d7', borderRadius: '0.5rem', borderLeft: '4px solid #e53e3e' }}>
                <h4 style={{ color: '#742a2a', marginBottom: '0.5rem' }}>Security</h4>
                <p style={{ margin: 0, color: '#742a2a', fontWeight: '600' }}>+880 1234 567891</p>
              </div>
              <div style={{ padding: '1rem', background: '#fef5e7', borderRadius: '0.5rem', borderLeft: '4px solid #d69e2e' }}>
                <h4 style={{ color: '#744210', marginBottom: '0.5rem' }}>Maintenance</h4>
                <p style={{ margin: 0, color: '#744210', fontWeight: '600' }}>+880 1234 567892</p>
              </div>
              <div style={{ padding: '1rem', background: '#c6f6d5', borderRadius: '0.5rem', borderLeft: '4px solid #22543d' }}>
                <h4 style={{ color: '#22543d', marginBottom: '0.5rem' }}>Community Manager</h4>
                <p style={{ margin: 0, color: '#22543d', fontWeight: '600' }}>+880 1234 567893</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <h3>Send us a Message</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a365d' }}>
                  <FaUser style={{ marginRight: '0.5rem' }} />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2d5a87'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a365d' }}>
                  <FaEnvelope style={{ marginRight: '0.5rem' }} />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2d5a87'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a365d' }}>
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2d5a87'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a365d' }}>
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '0.5rem',
                    fontSize: '1rem',
                    resize: 'vertical',
                    transition: 'border-color 0.3s ease'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#2d5a87'}
                  onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                />
              </div>
              
              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #1a365d, #2d5a87)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 1.5rem',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Send Message
              </button>
              
              {submitted && (
                <div style={{
                  background: '#c6f6d5',
                  color: '#22543d',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #9ae6b4',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  Thank you! Your message has been sent successfully.
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}