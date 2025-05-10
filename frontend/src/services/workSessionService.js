import { useState } from 'react';
import api from './api';

export function useWorkSessions() {
  const [activeSession, setActiveSession] = useState(null);

  const loadActiveSession = async () => {
    try {
      const response = await api.get('/work/me');
      const sessions = response.data;
      const active = sessions.find((session) => !session.endTime);
      setActiveSession(active || null);
      return active;
    } catch (error) {
      console.error('Failed to load active session:', error);
      setActiveSession(null);
      throw error;
    }
  };

  const startSession = async (projectId, description) => {
    const response = await api.post('/work/start', { projectId, description });
    setActiveSession(response.data);
    return response.data;
  };

  const stopSession = async () => {
    await api.post('/work/stop');
    setActiveSession(null);
  };

  const fetchWorkSessions = async () => {
    const response = await api.get('/work/me');
    return response.data;
  };

  const fetchUserWorkTimeByDay = async () => {
    const response = await api.get('/work/time-by-day');
    return response.data;
  };

  const fetchAllUsersWorkTimeByDay = async (userIds) => {
    const params = userIds.length > 0 ? { userIds } : {};
    const response = await api.get('/work/all-time-by-day', { params });
    return response.data;
  };

  const fetchUsers = async () => {
    const response = await api.get('/users');
    return response.data;
  };

  const fetchAllActiveSessions = async () => {
    const response = await api.get('/work/active-sessions');
    return response.data;
  };

  const fetchAllSessions = async () => {
    const response = await api.get('/work/all-sessions');
    return response.data;
  };

  const fetchTotalTimeByProject = async () => {
    const response = await api.get('/work/total-time-by-project');
    return response.data;
  };

  return {
    activeSession,
    setActiveSession, // Expose for TimeTracker.jsx
    loadActiveSession,
    startSession,
    stopSession,
    fetchWorkSessions,
    fetchUserWorkTimeByDay,
    fetchAllUsersWorkTimeByDay,
    fetchUsers,
    fetchAllActiveSessions,
    fetchAllSessions,
    fetchTotalTimeByProject,
  };
}