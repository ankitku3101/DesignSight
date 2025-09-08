'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Project = {
  _id: string;
  name: string;
};

const API_URL = process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:5000';

export default function Home() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/projects`);
      const data = await res.json();
      setProjects(data);
    } catch (e) {
      setError('Failed to fetch projects');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async () => {
    if (!newProjectName.trim()) {
      setError('Project name is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName.trim() }),
      });
      if (!res.ok) {
        const { message } = await res.json();
        setError(message || 'Failed to create project');
        setLoading(false);
        return;
      }
      const project = await res.json();
      setNewProjectName('');
      setProjects(prev => [project, ...prev]);
    } catch (e) {
      setError('Server error');
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Project Dashboard</h1>

      <div className="mb-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Create New Project</h2>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Enter project name"
            value={newProjectName}
            onChange={e => setNewProjectName(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition disabled:bg-gray-100"
            disabled={loading}
          />
          <button
            onClick={createProject}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
        {error && (
          <p className="text-red-500 mt-3 text-sm animate-fade-in">{error}</p>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Projects</h2>
        {loading && <p className="text-gray-500 italic">Loading projects...</p>}
        {!loading && projects.length === 0 && (
          <p className="text-gray-500">No projects found. Create one above.</p>
        )}
        {!loading && projects.length > 0 && (
          <ul className="grid gap-3">
            {projects.map(proj => (
              <li
                key={proj._id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
              >
                <button
                  onClick={() => router.push(`/projects/${proj._id}/screens`)}
                  className="w-full text-left text-blue-600 font-medium hover:text-blue-800 transition"
                >
                  {proj.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}