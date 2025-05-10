import { useState } from 'react';
import api from './api';

export function useWorkSessions() {
  const [activeSession, setActiveSession] = useState(null);

  const loadActiveSession = async () => {
    try {
      const response = await api.get('/work/me');
      const sessions = response.data;
      setActiveSession(sessions.find((session) => !session.endTime) || null);
    } catch {
      setActiveSession(null);
    }
  };

  const startSession = async (projectId, description) => {
    const response = await api.post('/work/start', { projectId, description });
    setActiveSession(response.data);
  };

  const stopSession = async () => {
    await api.post('/work/stop');
    setActiveSession(null);
  };

  const fetchUserWorkTimeByDay = async () => {
    const response = await api.get('/work/time-by-day');
    return response.data;
  };

  const fetchAllUsersWorkTimeByDay = async (userIds = []) => {
    const params = userIds.length > 0 ? { userIds } : {};
    const response = await api.get('/work/all-time-by-day', { params });
    return response.data;
  };

  const fetchUsers = async () => {
    const response = await api.get('/users');
    return response.data;
  };

  return {
    activeSession,
    loadActiveSession,
    startSession,
    stopSession,
    fetchUserWorkTimeByDay,
    fetchAllUsersWorkTimeByDay,
    fetchUsers,
  };
}