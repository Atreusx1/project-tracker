import { useState } from 'react';
import api from './api';

export function useProjects() {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    const response = await api.get('/projects');
    setProjects(response.data.docs);
  };

  const createProject = async (name, description) => {
    const response = await api.post('/projects', { name, description });
    setProjects((prev) => [...prev, response.data]);
  };

  return {
    projects,
    fetchProjects,
    createProject,
  };
}