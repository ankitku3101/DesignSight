import { Router } from 'express';
import multer from 'multer';
import { Screen } from '../models/Screen';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { analyzeImageWithGoogleVision } from '../services/googleVision';
import { getHybridUIUXSuggestions } from '../services/gemini'; // <-- import Gemini service

dotenv.config();

const router = Router();
const baseUrl = process.env.BE_URL || 'http://localhost:5000';

// Multer config
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const ext = path.extname(file.originalname);
      cb(null, `${timestamp}_${file.originalname}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Upload & analyze route
router.post('/projects/:id/screens', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No file uploaded.');

    const projectId = req.params.id;

    // Ensure Google credentials are set
    process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, '../secrets/google-api.json');

    // 1️⃣ Analyze image with Google Vision
    const feedback = await analyzeImageWithGoogleVision(req.file.path);

    // 2️⃣ Get Gemini UX/UI suggestions based on Vision feedback
    const geminiSuggestions = await getHybridUIUXSuggestions(feedback, req.file.path);

    // 3️⃣ Save to MongoDB
    const newScreen = new Screen({
      projectId,
      imageUrl: `${baseUrl}/uploads/${req.file.filename}`,
      feedbackItems: feedback,
      geminiSuggestions,
      uploadedAt: new Date(),
    });

    await newScreen.save();

    res.status(201).send({
      message: 'Image uploaded, analyzed, and UX suggestions generated successfully!',
      screen: newScreen,
      feedback,
      geminiSuggestions,
    });
  } catch (error) {
    console.error('Unexpected Error:', error);
    res.status(500).send({ message: 'Unexpected error occurred', error: (error as Error).message });
  }
});

// Get all screens for a project
router.get('/projects/:id/screens', async (req, res) => {
  try {
    const projectId = req.params.id;
    const screens = await Screen.find({ projectId }).sort({ uploadedAt: -1 });
    res.status(200).json({ screens });
  } catch (error) {
    console.error('Error fetching screens:', error);
    res.status(500).json({ message: 'Failed to fetch screens', error: (error as Error).message });
  }
});

// Get a specific screen by ID
router.get('/projects/:id/screens/:screenId', async (req, res) => {
  try {
    const { id, screenId } = req.params;
    const screen = await Screen.findOne({ _id: screenId, projectId: id });

    if (!screen) {
      return res.status(404).json({ message: 'Screen not found' });
    }

    // Return Gemini suggestions as plain text entries
    res.status(200).json({
      screen: {
        _id: screen._id,
        imageUrl: screen.imageUrl,
        feedbackItems: screen.feedbackItems || [],
        geminiSuggestions: screen.geminiSuggestions || [],
      },
    });
    
  } catch (error) {
    console.error('Error fetching screen:', error);
    res.status(500).json({ message: 'Failed to fetch screen', error: (error as Error).message });
  }
});


// Export screen + feedback
router.get('/screens/:screenId/export', async (req, res) => {
  try {
    const screenId = req.params.screenId;
    const screen = await Screen.findById(screenId);
    if (!screen) return res.status(404).json({ message: 'Screen not found' });

    const exportData = {
      projectId: screen.projectId,
      imageUrl: screen.imageUrl,
      feedbackItems: screen.feedbackItems || [],
      geminiSuggestions: screen.geminiSuggestions || [],
      exportedAt: new Date(),
    };

    res.status(200).json(exportData);
  } catch (error) {
    console.error('Error exporting screen:', error);
    res.status(500).json({ message: 'Failed to export screen', error: (error as Error).message });
  }
});

export default router;
