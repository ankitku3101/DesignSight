import { Project } from '../models/Project.model';

function generateProjectName(): string {
  const suffix = Math.random().toString(36).slice(2, 8);
  return `Untitled-${suffix}`;
}

// No standalone "create project" step — a project is just a name attached to a screen
// upload, reused silently if it already exists, auto-generated if left blank.
export async function findOrCreateProject(name: string | undefined) {
  const trimmed = name?.trim();
  const resolvedName = trimmed && trimmed.length > 0 ? trimmed : generateProjectName();

  const existing = await Project.findOne({ name: resolvedName });
  if (existing) return existing;

  return Project.create({ name: resolvedName });
}
