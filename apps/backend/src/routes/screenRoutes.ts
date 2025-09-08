import { Router } from 'express';
import multer from 'multer';
import { Screen } from '../models/Screen';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { analyzeImageWithGoogleVision } from '../services/googleVision';

dotenv.config();

const router = Router();

// Configure Multer (store files in /uploads)
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Route: Upload screen + analyze
router.post('/projects/:id/screens', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No file uploaded.');

    const projectId = req.params.id;

    // Ensure credentials are set
    process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, '../secrets/google-api.json');

    // Analyze with Google Vision API
    const feedback = await analyzeImageWithGoogleVision(req.file.path);

    // Save to MongoDB
    const newScreen = new Screen({
      projectId,
      imageUrl: `/uploads/${req.file.filename}`, // local URL
      feedbackItems: feedback,
      uploadedAt: new Date(),
    });

    await newScreen.save();

    res.status(201).send({
      message: 'Image uploaded & analyzed successfully!',
      screen: newScreen,
      feedback,
    });
  } catch (error) {
    console.error('Unexpected Error:', error);
    res.status(500).send({ message: 'Unexpected error occurred', error: (error as Error).message });
  }
});

export default router;
