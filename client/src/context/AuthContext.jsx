import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('quickcheck_token'));
  const [loading, setLoading] = useState(true);

  // Set default axios header
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('/api/auth/me');
        setUser(res.data.user);
      } catch (err) {
        console.error('Session verify failed:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    const { token: authToken, user: userData } = res.data;
    localStorage.setItem('quickcheck_token', authToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    setToken(authToken);
    setUser(userData);
    return userData;
  };

  const register = async (formData) => {
    const res = await axios.post('/api/auth/register', formData);
    const { token: authToken, user: userData } = res.data;
    localStorage.setItem('quickcheck_token', authToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    setToken(authToken);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('quickcheck_token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  const loginAsDemo = async (role) => {
    let email = 'user@quickcheck.ai';
    if (role === 'organization') email = 'org@stanford.edu';
    if (role === 'admin') email = 'admin@quickcheck.ai';
    return await login(email, 'password123');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, loginAsDemo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
