import { useState } from 'react';
import api from './api';

export function useWorkSessions() {
  const [activeSession, setActiveSession] = useState(null);

  const loadActiveSession = async () => {
    try {
      const response = await api.get('/work/active');
      setActiveSession(response.data);
    } catch (error) {
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
    loadActiveSession,
    startSession,
    stopSession,
    fetchUserWorkTimeByDay,
    fetchAllUsersWorkTimeByDay,
    fetchUsers,
    fetchAllActiveSessions,
    fetchAllSessions,
    fetchTotalTimeByProject,
  };
}