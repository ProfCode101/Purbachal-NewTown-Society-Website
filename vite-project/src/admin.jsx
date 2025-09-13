import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [notices, setNotices] = useState([]);
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    attendees: '',
    type: 'meeting'
  });

  const token = localStorage.getItem('token');

  const fetchUsers = () => {
    axios.get('http://localhost:3001/admin/users', { headers: { Authorization: token }})
      .then(r => setUsers(r.data.users || []))
      .catch(() => {});
  };

  const fetchEvents = () => {
    axios.get('http://localhost:3001/events', { headers: { Authorization: token }})
      .then(r => setEvents(r.data.events || []))
      .catch(() => {});
  };

  useEffect(() => {
    axios.get('http://localhost:3001/notices', { headers: { Authorization: token }})
      .then(r => setNotices(r.data.notices || []))
      .catch(() => {});
    fetchUsers();
    fetchEvents();
  }, []);

  const createNotice = async () => {
    if (!title || !body) return;
    const res = await axios.post('http://localhost:3001/admin/notices', { title, body }, { headers: { Authorization: token } });
    setNotices([res.data.notice, ...notices]);
    setTitle('');
    setBody('');
  };

  const deleteNotice = async (id) => {
    await axios.delete(`http://localhost:3001/admin/notices/${id}`, { headers: { Authorization: token } });
    setNotices(notices.filter(n => n.id !== id));
  };

  const approveMember = async (userId) => {
    await axios.post(`http://localhost:3001/admin/members/${userId}/approve`, {}, { headers: { Authorization: token } });
    fetchUsers();
  };

  const removeMember = async (userId) => {
    await axios.post(`http://localhost:3001/admin/members/${userId}/remove`, {}, { headers: { Authorization: token } });
    fetchUsers();
  };

  const declineMember = async (userId) => {
    await axios.post(`http://localhost:3001/admin/members/${userId}/decline`, {}, { headers: { Authorization: token } });
    fetchUsers();
  };

  const createEvent = async () => {
    if (!eventForm.title || !eventForm.date || !eventForm.time || !eventForm.location || !eventForm.description) return;
    const res = await axios.post('http://localhost:3001/admin/events', eventForm, { headers: { Authorization: token } });
    setEvents([...events, res.data.event]);
    setEventForm({
      title: '',
      date: '',
      time: '',
      location: '',
      description: '',
      attendees: '',
      type: 'meeting'
    });
  };

  const deleteEvent = async (eventId) => {
    await axios.delete(`http://localhost:3001/admin/events/${eventId}`, { headers: { Authorization: token } });
    fetchEvents();
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Admin Dashboard</h2>

      <section style={{ marginBottom: 24 }}>
        <h3>Create Notice</h3>
        <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
        <br />
        <textarea placeholder="Body" value={body} onChange={e => setBody(e.target.value)} />
        <br />
        <button onClick={createNotice}>Post Notice</button>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3>Notices</h3>
        <ul>
          {notices.map(n => (
            <li key={n.id}>
              <b>{n.title}</b> - {n.body}
              <button onClick={() => deleteNotice(n.id)} style={{ marginLeft: 8 }}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3>Create Event</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <input 
            placeholder="Event Title" 
            value={eventForm.title} 
            onChange={e => setEventForm({...eventForm, title: e.target.value})} 
          />
          <input 
            type="date" 
            value={eventForm.date} 
            onChange={e => setEventForm({...eventForm, date: e.target.value})} 
          />
          <input 
            type="time" 
            value={eventForm.time} 
            onChange={e => setEventForm({...eventForm, time: e.target.value})} 
          />
          <input 
            placeholder="Location" 
            value={eventForm.location} 
            onChange={e => setEventForm({...eventForm, location: e.target.value})} 
          />
          <input 
            placeholder="Expected Attendees" 
            type="number"
            value={eventForm.attendees} 
            onChange={e => setEventForm({...eventForm, attendees: e.target.value})} 
          />
          <select 
            value={eventForm.type} 
            onChange={e => setEventForm({...eventForm, type: e.target.value})}
          >
            <option value="meeting">Meeting</option>
            <option value="festival">Festival</option>
            <option value="seminar">Seminar</option>
            <option value="volunteer">Volunteer</option>
          </select>
        </div>
        <textarea 
          placeholder="Event Description" 
          value={eventForm.description} 
          onChange={e => setEventForm({...eventForm, description: e.target.value})}
          style={{ width: '100%', minHeight: '80px', marginBottom: '1rem' }}
        />
        <button onClick={createEvent}>Create Event</button>
      </section>

      <section style={{ marginBottom: 24 }}>
        <h3>Events</h3>
        <ul>
          {events.map(e => (
            <li key={e.id} style={{ marginBottom: '1rem', padding: '1rem', background: '#f7fafc', borderRadius: '0.5rem' }}>
              <b>{e.title}</b> - {e.date} at {e.time}<br />
              <small>{e.location} | {e.type} | {e.attendees} attendees</small><br />
              <button onClick={() => deleteEvent(e.id)} style={{ marginTop: '0.5rem' }}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3>Membership Actions (enter UserId)</h3>
        <ApproveRemove onApprove={approveMember} onRemove={removeMember} />
      </section>

      <section style={{ marginTop: 24 }}>
        <h3>Users</h3>
        <table border="1" cellPadding="6" cellSpacing="0">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Requested Plot</th>
              <th>Assigned Plot</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id || u.email}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.membershipStatus}</td>
                <td>{u.requestedPlotNumber || '-'}</td>
                <td>{u.plotNumber || '-'}</td>
                <td>
                  {u.membershipStatus === 'pending' && (
                    <>
                      <button onClick={() => approveMember(u._id)} style={{ marginRight: 8 }}>Accept</button>
                      <button onClick={() => declineMember(u._id)}>Decline</button>
                    </>
                  )}
                  {u.membershipStatus === 'active' && (
                    <button onClick={() => removeMember(u._id)}>Remove</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function ApproveRemove({ onApprove, onRemove }) {
  const [userId, setUserId] = useState('');
  return (
    <div>
      <input placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)} />
      <button onClick={() => onApprove(userId)} style={{ marginLeft: 8 }}>Approve</button>
      <button onClick={() => onRemove(userId)} style={{ marginLeft: 8 }}>Remove</button>
    </div>
  );
}

export default AdminDashboard;


