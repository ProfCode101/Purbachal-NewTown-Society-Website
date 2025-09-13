import React, { useState } from 'react';
import axios from 'axios';

function ApplyMembership() {
  const [form, setForm] = useState({
    phone: '',
    address: '',
    plotNumber: ''
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:3001/membership/apply', form, {
        headers: { Authorization: token }
      });
      setStatus(res.data.membershipStatus || 'pending');
      setSuccess('Application submitted. Awaiting admin approval.');
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to apply');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Membership Application</h2>
      <p>Please provide your contact information and your plot number. Only one member can be approved per plot number.</p>
      <form onSubmit={submit} style={{ maxWidth: 500, display: 'grid', gap: 12 }}>
        <div>
          <label>Phone</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="e.g. +8801XXXXXXXXX"
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div>
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            placeholder="Your current address"
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <div>
          <label>Plot Number</label>
          <input
            type="text"
            name="plotNumber"
            value={form.plotNumber}
            onChange={handleChange}
            required
            placeholder="e.g. Block A - Plot 12"
            style={{ width: '100%', padding: 8 }}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
      {status && <p style={{ marginTop: 12 }}>Status: {status}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default ApplyMembership;


