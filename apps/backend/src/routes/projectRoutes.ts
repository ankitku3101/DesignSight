import { Router } from 'express';
import { Project } from '../models/Project';

const router = Router();

// Create project
router.post('/projects', async (req, res) => {
  try {
    // Handle both JSON { name: "..." } and plain text "..."
    const name =
      typeof req.body === 'string' ? req.body.trim() : req.body?.name?.trim();

    if (!name) return res.status(400).json({ message: 'Name is required' });

    const existing = await Project.findOne({ name });
    if (existing)
      return res.status(400).json({ message: 'Project name exists' });

    const newProject = new Project({ name });
    await newProject.save();

    res.status(201).json(newProject);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    res.status(500).json({ message: 'Server error', error: errorMessage });
  }
});

// List all projects
router.get('/projects', async (_, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e);
    res.status(500).json({ message: 'Server error', error: errorMessage });
  }
});

export default router;
