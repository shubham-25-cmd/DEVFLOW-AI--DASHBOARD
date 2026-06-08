import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    window.location.href = `${apiUrl}/auth/github`;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);