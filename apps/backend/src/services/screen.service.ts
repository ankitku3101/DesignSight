import { Screen } from '../models/Screen.model';
import { Feedback, type FeedbackDocument } from '../models/Feedback.model';
import { findOrCreateProject } from './project.service';
import { uploadScreenImage } from './storage/cloudinary.service';
import { analyzeScreen } from './ai/analyzeScreen';
import { AppError } from '../middleware/errorHandler.middleware';

export async function uploadAndAnalyzeScreen(
  projectName: string | undefined,
  file: Express.Multer.File,
) {
  const project = await findOrCreateProject(projectName);
  const image = await uploadScreenImage(file.buffer);

  const screen = await Screen.create({
    projectId: project._id,
    imageUrl: image.secureUrl,
    imagePublicId: image.publicId,
    imageWidth: image.width,
    imageHeight: image.height,
    status: 'processing',
  });

  try {
    const items = await analyzeScreen(file.buffer, file.mimetype);
    // createdAt is populated by the schema default; insertMany's input typing doesn't
    // account for schema defaults, so the cast just tells TS what Mongoose does at runtime.
    const feedback = await Feedback.insertMany(
      items.map((item) => ({ ...item, screenId: screen._id })) as FeedbackDocument[],
    );
    screen.status = 'analyzed';
    await screen.save();
    return { screen, feedback, project };
  } catch (error) {
    // Never silently swallow a failed analysis — surface it on the Screen so the
    // frontend can show a real failed state instead of an empty feedback list.
    screen.status = 'failed';
    screen.error = error instanceof Error ? error.message : 'AI analysis failed';
    await screen.save();
    return { screen, feedback: [], project };
  }
}

export async function listRecentScreens(limit = 24) {
  return Screen.find().sort({ uploadedAt: -1 }).limit(limit).populate('projectId', 'name');
}

export async function getScreenById(screenId: string) {
  const screen = await Screen.findById(screenId).populate('projectId', 'name');
  if (!screen) throw new AppError(404, 'Screen not found');
  return screen;
}

export async function listFeedbackForScreen(screenId: string) {
  return Feedback.find({ screenId }).sort({ createdAt: 1 });
}
