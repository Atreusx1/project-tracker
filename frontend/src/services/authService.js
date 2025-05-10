import { useState, useEffect } from 'react';
import api from './api';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const register = async (email, password) => {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  };

  const confirmEmail = async (token) => {
    await api.get(`/auth/confirm-email/${token}`);
  };

  const login = async (email, password) => {
    await api.post('/auth/login', { email, password });
    await checkAuth();
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
    setIsAuthenticated(false);
  };

  return {
    user,
    isAuthenticated,
    checkAuth,
    register,
    confirmEmail,
    login,
    logout,
  };
}