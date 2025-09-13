import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserCheck, FaUserClock, FaUserTimes } from 'react-icons/fa';
import { useAuth } from './contexts/AuthContext';
import axios from 'axios';
import './Home.css';

export default function Members() {
  const { isMember, isAdmin } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMembers = async () => {
      if (!isMember && !isAdmin) {
        setLoading(false);
        return;
      }
      
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/members', {
          headers: { Authorization: token }
        });
        setMembers(response.data.users || []);
      } catch (err) {
        setError('Failed to load members');
        console.error('Error fetching members:', err);
        console.error('Error details:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [isMember, isAdmin]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <FaUserCheck style={{ color: '#22543d' }} />;
      case 'pending': return <FaUserClock style={{ color: '#744210' }} />;
      case 'removed': return <FaUserTimes style={{ color: '#742a2a' }} />;
      default: return <FaUsers style={{ color: '#4a5568' }} />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = 'status-badge';
    switch (status) {
      case 'active': return `${baseClasses} status-active`;
      case 'pending': return `${baseClasses} status-pending`;
      case 'removed': return `${baseClasses} status-removed`;
      default: return `${baseClasses} status-none`;
    }
  };

  if (!isMember && !isAdmin) {
    return (
      <div className="main-content">
        <div className="dashboard-header">
          <h1>Members Directory</h1>
        </div>
        <div className="card">
          <h3>Access Restricted</h3>
          <p style={{ color: '#666', fontStyle: 'italic' }}>
            The members directory is only available to active members and administrators. Please apply for membership to access the community member list.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="main-content">
        <div className="dashboard-header">
          <h1>Members Directory</h1>
        </div>
        <div className="card">
          <p>Loading members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="dashboard-header">
          <h1>Members Directory</h1>
        </div>
        <div className="card">
          <p style={{ color: '#e53e3e' }}>{error}</p>
        </div>
      </div>
    );
  }

  const activeMembers = members.filter(m => m.membershipStatus === 'active');
  const pendingMembers = members.filter(m => m.membershipStatus === 'pending');
  const totalMembers = members.length;

  return (
    <div className="main-content">
      <div className="dashboard-header">
        <h1>Members Directory</h1>
      </div>

      <div className="card">
        <h3><FaUsers /> Community Statistics</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ padding: '1rem', background: '#c6f6d5', borderRadius: '0.5rem', textAlign: 'center' }}>
            <h4 style={{ color: '#22543d', marginBottom: '0.5rem' }}>Total Members</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22543d' }}>{totalMembers}</p>
          </div>
          <div style={{ padding: '1rem', background: '#c6f6d5', borderRadius: '0.5rem', textAlign: 'center' }}>
            <h4 style={{ color: '#22543d', marginBottom: '0.5rem' }}>Active Members</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22543d' }}>{activeMembers.length}</p>
          </div>
          <div style={{ padding: '1rem', background: '#fef5e7', borderRadius: '0.5rem', textAlign: 'center' }}>
            <h4 style={{ color: '#744210', marginBottom: '0.5rem' }}>Pending Approval</h4>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#744210' }}>{pendingMembers.length}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>All Members</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#1a365d', fontWeight: '600' }}>Name</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#1a365d', fontWeight: '600' }}>Email</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#1a365d', fontWeight: '600' }}>Role</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#1a365d', fontWeight: '600' }}>Status</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#1a365d', fontWeight: '600' }}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {getStatusIcon(member.membershipStatus)}
                    <span style={{ fontWeight: '500' }}>{member.name}</span>
                  </td>
                  <td style={{ padding: '1rem', color: '#4a5568' }}>{member.email}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '1rem', 
                      fontSize: '0.75rem', 
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      background: member.role === 'admin' ? '#fed7d7' : member.role === 'member' ? '#c6f6d5' : '#e2e8f0',
                      color: member.role === 'admin' ? '#742a2a' : member.role === 'member' ? '#22543d' : '#4a5568'
                    }}>
                      {member.role}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span className={getStatusBadge(member.membershipStatus)}>
                      {member.membershipStatus}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#4a5568', fontSize: '0.9rem' }}>
                    {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}