import { useState, useEffect } from 'react';
import ProjectForm from '../components/ProjectForm';
import { useProjects } from '../services/projectService';
import { useWorkSessions } from '../services/workSessionService';
import styles from './Projects.module.css';

function Projects() {
  const { projects, fetchProjects } = useProjects();
  const { fetchTotalTimeByProject } = useWorkSessions();
  const [totalTimes, setTotalTimes] = useState({});

  useEffect(() => {
    const loadData = async () => {
      await fetchProjects();
      try {
        const totalTimeData = await fetchTotalTimeByProject();
        const timeMap = totalTimeData.reduce((acc, { projectId, totalHours }) => {
          acc[projectId] = totalHours;
          return acc;
        }, {});
        setTotalTimes(timeMap);
      } catch (error) {
        console.error('Failed to load total time by project:', error);
      }
    };
    loadData();
  }, [fetchProjects, fetchTotalTimeByProject]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Projects</h1>
      <ProjectForm />
      <div className={styles.projectList}>
        <h2 className={styles.subtitle}>Project List</h2>
        {projects.length === 0 ? (
          <p className={styles.noProjects}>No projects available.</p>
        ) : (
          <ul className={styles.list}>
            {projects.map((project) => (
              <li key={project._id} className={styles.listItem}>
                <h3 className={styles.projectName}>{project.name}</h3>
                <p className={styles.projectDescription}>
                  {project.description || 'No description'}
                </p>
                <p className={styles.projectCreated}>
                  <strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}
                </p>
                <p className={styles.projectTime}>
                  <strong>Total Time:</strong>{' '}
                  {totalTimes[project._id]
                    ? `${totalTimes[project._id].toFixed(2)} hours`
                    : '0.00 hours'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Projects;