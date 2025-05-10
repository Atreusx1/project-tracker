import { useState, useEffect } from 'react';
import { useProjects } from '../services/projectService';
import { useWorkSessions } from '../services/workSessionService';
import WorkTimeChart from './WorkTimeChart';
import styles from './TimeTracker.module.css';

function TimeTracker() {
  const [projectId, setProjectId] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { projects, fetchProjects } = useProjects();
  const { activeSession, startSession, stopSession, loadActiveSession } = useWorkSessions();

  useEffect(() => {
    fetchProjects();
    loadActiveSession();
  }, []);

  const handleStart = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await startSession(projectId, description);
      setProjectId('');
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    setLoading(true);
    setError('');
    try {
      await stopSession();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to stop session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Time Tracker</h2>
      {activeSession ? (
        <div className={styles.activeSession}>
          <p>Active session: {activeSession.description || 'No description'}</p>
          <p>Project: {activeSession.project.name}</p>
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
      <div className={styles.chartContainer}>
        <WorkTimeChart />
      </div>
    </div>
  );
}

export default TimeTracker;