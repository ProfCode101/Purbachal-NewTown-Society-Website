import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUsers, FaPlus } from 'react-icons/fa';
import { useAuth } from './contexts/AuthContext';
import axios from 'axios';
import './Home.css';

export default function Events() {
  const { isMember } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      if (!isMember) {
        setLoading(false);
        return;
      }
      
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/events', {
          headers: { Authorization: token }
        });
        setEvents(response.data.events || []);
      } catch (err) {
        setError('Failed to load events');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [isMember]);

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'meeting': return '#2d5a87';
      case 'festival': return '#d69e2e';
      case 'seminar': return '#e53e3e';
      case 'volunteer': return '#22543d';
      default: return '#4a5568';
    }
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      // case 'meeting': return '🏢';
      // case 'festival': return '🎉';
      // case 'seminar': return '📚';
      // case 'volunteer': return '🤝';
      default: return '*';
    }
  };

  if (!isMember) {
    return (
      <div className="main-content">
        <div className="dashboard-header">
          <h1>Community Events</h1>
        </div>
        <div className="card">
          <h3>Access Restricted</h3>
          <p style={{ color: '#666', fontStyle: 'italic' }}>
            Community events are only available to active members. Please apply for membership to access event information and participate in community activities.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="dashboard-header">
        <h1>Community Events</h1>
      </div>

      <div className="card">
        <h3><FaCalendarAlt /> Upcoming Events</h3>
        {loading ? (
          <p>Loading events...</p>
        ) : error ? (
          <p style={{ color: '#e53e3e' }}>{error}</p>
        ) : events.length === 0 ? (
          <p>No events scheduled yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {events.map((event) => (
            <div key={event.id} style={{ 
              padding: '1.5rem', 
              background: '#f7fafc', 
              borderRadius: '1rem', 
              border: '1px solid #e2e8f0',
              borderLeft: `4px solid ${getEventTypeColor(event.type)}`,
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ 
                    color: '#1a365d', 
                    marginBottom: '0.5rem', 
                    fontSize: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>{getEventTypeIcon(event.type)}</span>
                    {event.title}
                  </h4>
                  <p style={{ color: '#4a5568', marginBottom: '1rem' }}>{event.description}</p>
                </div>
                <span style={{ 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '1rem', 
                  fontSize: '0.75rem', 
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  background: getEventTypeColor(event.type),
                  color: 'white'
                }}>
                  {event.type}
                </span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4a5568' }}>
                  <FaCalendarAlt style={{ color: getEventTypeColor(event.type) }} />
                  <span>{new Date(event.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4a5568' }}>
                  <FaClock style={{ color: getEventTypeColor(event.type) }} />
                  <span>{event.time}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4a5568' }}>
                  <FaMapMarkerAlt style={{ color: getEventTypeColor(event.type) }} />
                  <span>{event.location}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4a5568' }}>
                  <FaUsers style={{ color: getEventTypeColor(event.type) }} />
                  <span>{event.attendees} expected</span>
                </div>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3>Event Categories</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#2d5a87', color: 'white', borderRadius: '0.5rem', textAlign: 'center' }}>
            <h4 style={{ marginBottom: '0.5rem' }}> Meetings</h4>
            <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Community governance and decision-making</p>
          </div>
          <div style={{ padding: '1rem', background: '#d69e2e', color: 'white', borderRadius: '0.5rem', textAlign: 'center' }}>
            <h4 style={{ marginBottom: '0.5rem' }}> Festivals</h4>
            <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Cultural celebrations and community bonding</p>
          </div>
          <div style={{ padding: '1rem', background: '#e53e3e', color: 'white', borderRadius: '0.5rem', textAlign: 'center' }}>
            <h4 style={{ marginBottom: '0.5rem' }}> Seminars</h4>
            <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Educational and professional development</p>
          </div>
          <div style={{ padding: '1rem', background: '#22543d', color: 'white', borderRadius: '0.5rem', textAlign: 'center' }}>
            <h4 style={{ marginBottom: '0.5rem' }}> Volunteer</h4>
            <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>Community service and social responsibility</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Event Guidelines</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#d69e2e' }}>*</span>
            <span>Please RSVP for events to help with planning and catering</span>
          </li>
          <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#d69e2e' }}>*</span>
            <span>Arrive 10 minutes early for meetings and seminars</span>
          </li>
          <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#d69e2e' }}>*</span>
            <span>Bring family and friends to community events</span>
          </li>
          <li style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ color: '#d69e2e' }}>*</span>
            <span>Contact the event organizer for any special requirements</span>
          </li>
        </ul>
      </div>
    </div>
  );
}