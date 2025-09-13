import React, { useState, useEffect } from 'react';
import { FaGavel, FaEdit, FaSave, FaTimes, FaList, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from './contexts/AuthContext';
import axios from 'axios';
import './Home.css';

export default function SocietyRules() {
  const { isMember, isAdmin } = useAuth();
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingRule, setEditingRule] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRule, setNewRule] = useState({
    title: '',
    description: '',
    category: 'general'
  });

  const categories = [
    { value: 'general', label: 'General Rules' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'security', label: 'Security' },
    { value: 'parking', label: 'Parking' },
    { value: 'noise', label: 'Noise Control' },
    { value: 'pets', label: 'Pet Policy' },
    { value: 'visitors', label: 'Visitor Policy' },
    { value: 'amenities', label: 'Common Amenities' }
  ];

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await axios.get('http://localhost:3001/society-rules');
        setRules(response.data.rules || []);
      } catch (err) {
        setError('Failed to load society rules');
        console.error('Error fetching rules:', err);
        console.error('Error details:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  const handleAddRule = async (e) => {
    e.preventDefault();
    if (!newRule.title || !newRule.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3001/society-rules', newRule, {
        headers: { Authorization: token }
      });

      if (response.data.success) {
        setRules([response.data.rule, ...rules]);
        setNewRule({ title: '', description: '', category: 'general' });
        setShowAddForm(false);
        alert('Rule added successfully!');
      }
    } catch (err) {
      console.error('Error adding rule:', err);
      alert('Failed to add rule');
    }
  };

  const handleUpdateRule = async (ruleId, updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:3001/society-rules/${ruleId}`, updatedData, {
        headers: { Authorization: token }
      });

      if (response.data.success) {
        setRules(rules.map(rule => 
          rule._id === ruleId ? { ...rule, ...updatedData } : rule
        ));
        setEditingRule(null);
        alert('Rule updated successfully!');
      }
    } catch (err) {
      console.error('Error updating rule:', err);
      alert('Failed to update rule');
    }
  };

  const handleDeleteRule = async (ruleId) => {
    if (!window.confirm('Are you sure you want to delete this rule?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/society-rules/${ruleId}`, {
        headers: { Authorization: token }
      });
      setRules(rules.filter(rule => rule._id !== ruleId));
      alert('Rule deleted successfully!');
    } catch (err) {
      console.error('Error deleting rule:', err);
      alert('Failed to delete rule');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: '#2d5a87',
      maintenance: '#d69e2e',
      security: '#e53e3e',
      parking: '#22543d',
      noise: '#744210',
      pets: '#553c9a',
      visitors: '#2c5282',
      amenities: '#2b6cb0'
    };
    return colors[category] || '#4a5568';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      general: '📋',
      maintenance: '🔧',
      security: '🔒',
      parking: '🚗',
      noise: '🔇',
      pets: '🐕',
      visitors: '👥',
      amenities: '🏢'
    };
    return icons[category] || '📄';
  };

  // Remove the access restriction - allow all logged-in users to view rules

  if (loading) {
    return (
      <div className="main-content">
        <div className="dashboard-header">
          <h1>Society Rules & Regulations</h1>
        </div>
        <div className="card">
          <p>Loading rules...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="dashboard-header">
          <h1>Society Rules & Regulations</h1>
        </div>
        <div className="card">
          <p style={{ color: '#e53e3e' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="dashboard-header">
        <h1>Society Rules & Regulations</h1>
        {isAdmin && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              background: 'linear-gradient(135deg, #1a365d, #2d5a87)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
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
            <FaEdit /> {showAddForm ? 'Cancel' : 'Add New Rule'}
          </button>
        )}
      </div>

      {isAdmin && showAddForm && (
        <div className="card">
          <h3><FaGavel /> Add New Rule</h3>
          <form onSubmit={handleAddRule} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a365d' }}>
                Rule Title *
              </label>
              <input
                type="text"
                value={newRule.title}
                onChange={(e) => setNewRule({ ...newRule, title: e.target.value })}
                required
                placeholder="e.g., Quiet Hours Policy"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a365d' }}>
                Category
              </label>
              <select
                value={newRule.category}
                onChange={(e) => setNewRule({ ...newRule, category: e.target.value })}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a365d' }}>
                Rule Description *
              </label>
              <textarea
                value={newRule.description}
                onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                required
                placeholder="Detailed description of the rule..."
                rows="4"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #22543d, #38a169)',
                color: 'white',
                border: 'none',
                padding: '1rem 1.5rem',
                borderRadius: '0.5rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <FaSave /> Add Rule
            </button>
          </form>
        </div>
      )}

      <div className="card">
        <h3><FaList /> Current Rules & Regulations</h3>
        {rules.length === 0 ? (
          <p style={{ color: '#666', fontStyle: 'italic', textAlign: 'center', padding: '2rem' }}>
            No rules have been added yet. {isAdmin && 'Add some rules to get started!'}
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {rules.map((rule) => (
              <div key={rule._id} style={{
                background: '#f7fafc',
                borderRadius: '1rem',
                padding: '1.5rem',
                border: '1px solid #e2e8f0',
                borderLeft: `4px solid ${getCategoryColor(rule.category)}`,
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>{getCategoryIcon(rule.category)}</span>
                    <div>
                      <h4 style={{ 
                        color: '#1a365d', 
                        marginBottom: '0.25rem',
                        fontSize: '1.2rem',
                        fontWeight: '600'
                      }}>
                        {rule.title}
                      </h4>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        background: getCategoryColor(rule.category),
                        color: 'white'
                      }}>
                        {categories.find(cat => cat.value === rule.category)?.label || rule.category}
                      </span>
                    </div>
                  </div>
                  
                  {isAdmin && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => setEditingRule(editingRule === rule._id ? null : rule._id)}
                        style={{
                          background: '#2d5a87',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.25rem',
                          padding: '0.5rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.8rem'
                        }}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteRule(rule._id)}
                        style={{
                          background: '#e53e3e',
                          color: 'white',
                          border: 'none',
                          borderRadius: '0.25rem',
                          padding: '0.5rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.8rem'
                        }}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  )}
                </div>
                
                {editingRule === rule._id ? (
                  <EditRuleForm
                    rule={rule}
                    onSave={(updatedData) => handleUpdateRule(rule._id, updatedData)}
                    onCancel={() => setEditingRule(null)}
                    categories={categories}
                  />
                ) : (
                  <p style={{ 
                    color: '#4a5568', 
                    lineHeight: '1.6',
                    marginBottom: '0.5rem'
                  }}>
                    {rule.description}
                  </p>
                )}
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginTop: '1rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #e2e8f0'
                }}>
                  <small style={{ color: '#666' }}>
                    Last updated: {new Date(rule.updatedAt || rule.createdAt).toLocaleDateString()}
                  </small>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#d69e2e' }}>
                    <FaExclamationTriangle style={{ fontSize: '0.8rem' }} />
                    <small style={{ fontWeight: '600' }}>Important</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EditRuleForm({ rule, onSave, onCancel, categories }) {
  const [editData, setEditData] = useState({
    title: rule.title,
    description: rule.description,
    category: rule.category
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a365d' }}>
          Rule Title
        </label>
        <input
          type="text"
          value={editData.title}
          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '2px solid #e2e8f0',
            borderRadius: '0.5rem',
            fontSize: '1rem'
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a365d' }}>
          Category
        </label>
        <select
          value={editData.category}
          onChange={(e) => setEditData({ ...editData, category: e.target.value })}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '2px solid #e2e8f0',
            borderRadius: '0.5rem',
            fontSize: '1rem'
          }}
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1a365d' }}>
          Rule Description
        </label>
        <textarea
          value={editData.description}
          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          required
          rows="3"
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '2px solid #e2e8f0',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            resize: 'vertical'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          type="submit"
          style={{
            background: 'linear-gradient(135deg, #22543d, #38a169)',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FaSave /> Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: '#e53e3e',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <FaTimes /> Cancel
        </button>
      </div>
    </form>
  );
}
