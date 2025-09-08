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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Project Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Create and manage your design review projects.</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-medium">Create New Project</h2>
        <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input
            type="text"
            placeholder="Enter project name"
            value={newProjectName}
            onChange={e => setNewProjectName(e.target.value)}
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/60"
            disabled={loading}
          />
          <button
            onClick={createProject}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md bg-foreground text-background px-4 py-2 text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Creating…' : 'Create Project'}
          </button>
        </div>
        {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-medium">Your Projects</h2>
        {loading && <p className="text-muted-foreground mt-2 text-sm">Loading projects…</p>}
        {!loading && projects.length === 0 && (
          <p className="text-muted-foreground mt-2 text-sm">No projects found. Create one above.</p>
        )}
        {!loading && projects.length > 0 && (
          <ul className="mt-4 grid gap-3">
            {projects.map(proj => (
              <li key={proj._id} className="group rounded-lg border border-border p-4 hover:bg-muted/40 transition">
                <button
                  onClick={() => router.push(`/projects/${proj._id}/screens`)}
                  className="w-full text-left flex items-center justify-between"
                >
                  <span className="font-medium group-hover:opacity-90">{proj.name}</span>
                  <span className="text-xs text-muted-foreground">Open →</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}