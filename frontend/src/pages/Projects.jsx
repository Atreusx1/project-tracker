import { useEffect } from 'react';
import ProjectForm from '../components/ProjectForm';
import { useProjects } from '../services/projectService';
import styles from './Projects.module.css';

function Projects() {
  const { projects, fetchProjects } = useProjects();

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Projects</h1>
      <ProjectForm />
      <div className={styles.projectList}>
        <h2 className={styles.subtitle}>Project List</h2>
        <ul className={styles.list}>
          {projects.map((project) => (
            <li key={project._id} className={styles.listItem}>
              <h3 className={styles.projectName}>{project.name}</h3>
              <p className={styles.projectDescription}>
                {project.description || 'No description'}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Projects;