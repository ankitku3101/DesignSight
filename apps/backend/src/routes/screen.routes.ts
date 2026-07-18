import { Router } from 'express';
import { upload } from '../middleware/upload.middleware';
import * as screenController from '../controllers/screen.controller';

const router = Router();

// Upload and analyze are deliberately separate actions: analysis costs a real Gemini
// call, so it only ever fires on an explicit second action, never automatically on upload.
router.post('/screens', upload.single('image'), screenController.uploadScreen);
router.post('/screens/:screenId/analyze', screenController.analyzeScreen);
router.get('/screens', screenController.listRecentScreens);
router.get('/screens/:screenId', screenController.getScreen);
router.get('/screens/:screenId/export', screenController.exportScreen);

export default router;
