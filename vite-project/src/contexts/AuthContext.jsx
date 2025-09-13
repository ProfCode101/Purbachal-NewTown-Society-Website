import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const API_BASE_URL = 'http://localhost:3001';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/verify`, {
        headers: { Authorization: token }
      });
      
      if (response.data.loggedIn) {
        setUser(response.data.user);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError('');
      setLoading(true);
      
      console.log('AuthContext: Attempting login to:', `${API_BASE_URL}/login`);
      const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
      console.log('AuthContext: Login response:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUser(response.data.user);
        setLoading(false);
        return { success: true };
      } else {
        setError('Login failed');
        setLoading(false);
        return { success: false, error: 'Login failed' };
      }
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      const errorMessage = error.response?.data?.error || 'Login failed';
      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (name, email, password, confirmPassword) => {
    try {
      setError('');
      setLoading(true);
      
      const response = await axios.post(`${API_BASE_URL}/register`, {
        name,
        email,
        password,
        confirmPassword
      });
      
      return { success: true, message: 'Account created successfully' };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError('');
  };

  const applyForMembership = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/membership/apply`, {}, {
        headers: { Authorization: token }
      });
      
      // Refresh user data
      await verifyToken(token);
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to apply for membership';
      return { success: false, error: errorMessage };
    }
  };

  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      await verifyToken(token);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    applyForMembership,
    refreshUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin' || user?.role === 'developer',
    isMember: user?.membershipStatus === 'active' || user?.role === 'admin' || user?.role === 'developer'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
