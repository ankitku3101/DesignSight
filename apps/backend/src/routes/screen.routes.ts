import { Router } from 'express';
import { upload } from '../middleware/upload.middleware';
import * as screenController from '../controllers/screen.controller';

const router = Router();

// Uploading a screen is the only "create" action in the whole app — the project it
// belongs to is resolved (or auto-created) inline, no separate project-creation step.
router.post('/screens', upload.single('image'), screenController.uploadScreen);
router.get('/screens', screenController.listRecentScreens);
router.get('/screens/:screenId', screenController.getScreen);

export default router;
