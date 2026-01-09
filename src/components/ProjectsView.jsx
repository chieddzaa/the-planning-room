import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import GlassCard from './GlassCard';

export default function ProjectsView() {
  const [projects, setProjects] = useLocalStorage('planning-room-projects', []);
  const [newProject, setNewProject] = useState('');

  const addProject = () => {
    if (newProject.trim()) {
      const project = {
        id: Date.now(),
        name: newProject.trim(),
        description: '',
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      setProjects([...projects, project]);
      setNewProject('');
    }
  };

  const updateProject = (id, field, value) => {
    setProjects(projects.map(project =>
      project.id === id ? { ...project, [field]: value } : project
    ));
  };

  const deleteProject = (id) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addProject();
    }
  };

  return (
    <div className="space-y-4">
      <GlassCard title="Projects" accent="blue">
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="New project name..."
              className="flex-1 px-3 py-2 border-2 border-windows-border bg-white focus:outline-none focus:border-windows-blue text-sm"
            />
            <button
              onClick={addProject}
              className="button-windows text-sm font-medium"
            >
              Add
            </button>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {projects.length === 0 ? (
              <p className="text-gray-500 text-sm py-4 text-center">No projects yet. Create one above!</p>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className="p-3 bg-white/50 border border-gray-200 hover:bg-white/70 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <input
                      type="text"
                      value={project.name}
                      onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 bg-white focus:outline-none focus:border-windows-blue text-sm font-semibold"
                    />
                    <select
                      value={project.status}
                      onChange={(e) => updateProject(project.id, 'status', e.target.value)}
                      className="px-2 py-1 border border-gray-300 bg-white focus:outline-none focus:border-windows-blue text-xs"
                    >
                      <option value="active">Active</option>
                      <option value="on-hold">On Hold</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <textarea
                    value={project.description || ''}
                    onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                    placeholder="Project description..."
                    rows="2"
                    className="w-full px-2 py-1 border border-gray-300 bg-white focus:outline-none focus:border-windows-blue text-sm resize-none mb-2"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Created: {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="text-red-600 hover:text-red-800 text-sm px-2"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}


