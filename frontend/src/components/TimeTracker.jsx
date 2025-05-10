import { useState, useEffect, useCallback, useRef } from 'react';
import { useProjects } from '../services/projectService';
import { useWorkSessions } from '../services/workSessionService';
import WorkTimeChart from './WorkTimeChart';
import styles from './TimeTracker.module.css';

function TimeTracker() {
  const [projectId, setProjectId] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [userSessions, setUserSessions] = useState([]);
  
  // Get hooks data and methods
  const { projects, fetchProjects } = useProjects();
  const { 
    activeSession, 
    startSession, 
    stopSession, 
    loadActiveSession, 
    fetchWorkSessions,
    setActiveSession  // Use this from the hook
  } = useWorkSessions();
  
  // Refs for managing fetch state
  const dataFetchedRef = useRef(false);
  const isFetchingRef = useRef(false);
  const requestCountRef = useRef(0);

  // Log API requests
  const logRequest = (url) => {
    requestCountRef.current += 1;
    console.log(`[${new Date().toISOString()}] Request ${requestCountRef.current}: ${url}`);
  };

  // Load initial data only once
  useEffect(() => {
    async function initialLoad() {
      if (dataFetchedRef.current || isFetchingRef.current) return;
      
      isFetchingRef.current = true;
      try {
        // Load projects only if we don't have any
        if (!projects || projects.length === 0) {
          logRequest('/api/projects');
          await fetchProjects();
        }
        
        // Load work sessions
        logRequest('/api/work/me');
        const sessions = await fetchWorkSessions();
        setUserSessions(sessions);
        
        // Find active session
        const active = sessions.find(session => !session.endTime);
        if (active) setActiveSession(active);
        
        dataFetchedRef.current = true;
      } catch (err) {
        console.error('Failed to load initial data:', err);
        setError('Failed to load initial data. Please refresh the page.');
      } finally {
        isFetchingRef.current = false;
      }
    }
    
    initialLoad();
  }, [fetchProjects, fetchWorkSessions, setActiveSession, projects]);

  // Timer for active session
  useEffect(() => {
    let timer;
    if (activeSession) {
      const startTime = new Date(activeSession.startTime).getTime();
      timer = setInterval(() => {
        const currentTime = Date.now();
        const secondsElapsed = Math.floor((currentTime - startTime) / 1000);
        setElapsedTime(secondsElapsed);
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    
    return () => clearInterval(timer);
  }, [activeSession]);

  // Handle session start
  const handleStart = useCallback(async (e) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError('');
    
    try {
      logRequest('/api/work/start');
      const session = await startSession(projectId, description);
      setActiveSession(session);
      setProjectId('');
      setDescription('');
      
      // Refresh sessions after starting a new one
      logRequest('/api/work/me');
      const updatedSessions = await fetchWorkSessions();
      setUserSessions(updatedSessions);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start session');
    } finally {
      setLoading(false);
    }
  }, [projectId, description, loading, startSession, fetchWorkSessions, setActiveSession]);

  // Handle session stop
  const handleStop = useCallback(async () => {
    if (loading) return;
    
    setLoading(true);
    setError('');
    
    try {
      logRequest('/api/work/stop');
      await stopSession();
      setElapsedTime(0);
      
      // Refresh sessions after stopping
      logRequest('/api/work/me');
      const updatedSessions = await fetchWorkSessions();
      setUserSessions(updatedSessions);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to stop session');
    } finally {
      setLoading(false);
    }
  }, [loading, stopSession, fetchWorkSessions]);

  // Format elapsed time as HH:MM:SS
  const formatElapsedTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Group user sessions by project and calculate total time
  const userProjects = userSessions.reduce((acc, session) => {
    const projectId = session.project._id;
    if (!acc[projectId]) {
      acc[projectId] = {
        project: session.project,
        sessions: [],
        totalHours: 0,
      };
    }
    acc[projectId].sessions.push(session);
    if (session.endTime) {
      const durationMs = new Date(session.endTime) - new Date(session.startTime);
      acc[projectId].totalHours += durationMs / (1000 * 60 * 60);
    }
    return acc;
  }, {});

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Time Tracker</h2>
      {activeSession ? (
        <div className={styles.activeSession}>
          <h3 className={styles.activeSessionTitle}>Active Session</h3>
          <p><strong>Project:</strong> {activeSession.project.name}</p>
          <p><strong>Description:</strong> {activeSession.description || 'No description'}</p>
          <p><strong>Elapsed Time:</strong> {formatElapsedTime(elapsedTime)}</p>
          <button
            onClick={handleStop}
            className={styles.stopButton}
            disabled={loading}
          >
            {loading ? 'Stopping...' : 'Stop Session'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleStart} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="project" className={styles.label}>
              Project
            </label>
            <select
              id="project"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
              className={styles.select}
            >
              <option value="" disabled>
                Select a project
              </option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
            />
          </div>
          <button
            type="submit"
            className={styles.startButton}
            disabled={loading}
          >
            {loading ? 'Starting...' : 'Start Session'}
          </button>
        </form>
      )}
      {error && <p className={styles.error}>{error}</p>}

      {/* User's Work History Section */}
      <div className={styles.userProjectList}>
        <h3 className={styles.subtitle}>Your Work History</h3>
        {Object.keys(userProjects).length === 0 ? (
          <p className={styles.noProjects}>You haven't worked on any projects yet.</p>
        ) : (
          <ul className={styles.list}>
            {Object.values(userProjects).map(({ project, sessions, totalHours }) => (
              <li key={project._id} className={styles.listItem}>
                <h4 className={styles.projectName}>{project.name}</h4>
                <p className={styles.projectDescription}>
                  {project.description || 'No description'}
                </p>
                <p className={styles.projectTime}>
                  <strong>Total Time Worked:</strong> {totalHours.toFixed(2)} hours
                </p>
                <div className={styles.sessionList}>
                  <h5 className={styles.sessionTitle}>Work Sessions</h5>
                  {sessions.length === 0 ? (
                    <p className={styles.noSessions}>No work sessions recorded.</p>
                  ) : (
                    <ul className={styles.sessionItems}>
                      {sessions.map((session) => {
                        const durationMs = session.endTime
                          ? new Date(session.endTime) - new Date(session.startTime)
                          : null;
                        const durationHours = durationMs
                          ? (durationMs / (1000 * 60 * 60)).toFixed(2)
                          : 'Ongoing';
                        return (
                          <li key={session._id} className={styles.sessionItem}>
                            <p className={styles.sessionDescription}>
                              <strong>Description:</strong>{' '}
                              {session.description || 'No description'}
                            </p>
                            <p className={styles.sessionTime}>
                              <strong>Started:</strong>{' '}
                              {new Date(session.startTime).toLocaleString()}
                            </p>
                            <p className={styles.sessionTime}>
                              <strong>Duration:</strong> {durationHours}{' '}
                              {durationHours === 'Ongoing' ? '' : 'hours'}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.chartContainer}>
        <WorkTimeChart />
      </div>
    </div>
  );
}

export default TimeTracker;