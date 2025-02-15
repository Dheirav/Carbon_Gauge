import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // If bypass mode is enabled, skip API validation and use dummy user
      if (process.env.REACT_APP_BYPASS_AUTH === "true") {
        setLoading(false);
        return;
      }

      if (token) {
        try {
          const response = await axios.get('/api/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
        } catch (err) {
          console.error('Auth error:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  useEffect(() => {
    if (process.env.REACT_APP_BYPASS_AUTH === "true") {
      const dummyUser = {
        name: "Guest User",
        email: "guest@example.com",
        role: process.env.REACT_APP_USER_ROLE || "regular",
      };
      setUser(dummyUser);
      setToken("dummy-token");
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      const { token: newToken, user: newUser } = response.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
    } catch (err) {
      console.error('Register error:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 