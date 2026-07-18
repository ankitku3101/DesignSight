import type { Request, Response } from 'express';
import { objectIdSchema } from '../validation/objectId';
import { uploadScreenSchema } from '../validation/screen.schema';
import { AppError } from '../middleware/errorHandler.middleware';
import * as screenService from '../services/screen.service';

export async function uploadScreen(req: Request, res: Response) {
  if (!req.file) throw new AppError(400, 'An image file is required');
  const { projectName } = uploadScreenSchema.parse(req.body);
  const result = await screenService.uploadAndAnalyzeScreen(projectName, req.file);
  res.status(201).json(result);
}

export async function listRecentScreens(_req: Request, res: Response) {
  const screens = await screenService.listRecentScreens();
  res.json(screens);
}

export async function getScreen(req: Request, res: Response) {
  const screenId = objectIdSchema.parse(req.params.screenId);
  const screen = await screenService.getScreenById(screenId);
  const feedback = await screenService.listFeedbackForScreen(screenId);
  res.json({ screen, feedback });
}
