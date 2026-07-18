import { Screen } from '../models/Screen.model';
import { Feedback, type FeedbackDocument } from '../models/Feedback.model';
import { findOrCreateProject } from './project.service';
import { uploadScreenImage } from './storage/cloudinary.service';
import { analyzeScreen } from './ai/analyzeScreen';
import { AppError } from '../middleware/errorHandler.middleware';
import { filterFeedbackForRole, type Role } from 'designsight-shared';

export async function uploadScreen(projectName: string | undefined, file: Express.Multer.File) {
  const project = await findOrCreateProject(projectName);
  const image = await uploadScreenImage(file.buffer);

  const screen = await Screen.create({
    projectId: project._id,
    imageUrl: image.secureUrl,
    imagePublicId: image.publicId,
    imageMimeType: file.mimetype,
    imageWidth: image.width,
    imageHeight: image.height,
    status: 'uploaded',
  });

  return { screen, project };
}

export async function analyzeScreenById(screenId: string) {
  const screen = await Screen.findById(screenId);
  if (!screen) throw new AppError(404, 'Screen not found');

  screen.status = 'processing';
  screen.error = null;
  await screen.save();

  // Re-analyzing (a retry after failure, or re-running an already-analyzed screen)
  // replaces the feedback set rather than appending a second copy alongside it.
  await Feedback.deleteMany({ screenId: screen._id });

  try {
    // The upload request's in-memory buffer is long gone by the time analysis is
    // triggered as a separate action, so the image is re-fetched from Cloudinary.
    const response = await fetch(screen.imageUrl);
    if (!response.ok) throw new Error(`Failed to fetch stored image: ${response.statusText}`);
    const buffer = Buffer.from(await response.arrayBuffer());

    const items = await analyzeScreen(buffer, screen.imageMimeType);
    // createdAt is populated by the schema default; insertMany's input typing doesn't
    // account for schema defaults, so the cast just tells TS what Mongoose does at runtime.
    const feedback = await Feedback.insertMany(
      items.map((item) => ({ ...item, screenId: screen._id })) as FeedbackDocument[],
    );
    screen.status = 'analyzed';
    await screen.save();
    return { screen, feedback };
  } catch (error) {
    // Never silently swallow a failed analysis — surface it on the Screen so the
    // frontend can show a real failed state instead of an empty feedback list.
    screen.status = 'failed';
    screen.error = error instanceof Error ? error.message : 'AI analysis failed';
    await screen.save();
    return { screen, feedback: [] };
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

export async function listFeedbackForScreen(screenId: string, role?: Role) {
  const feedback = await Feedback.find({ screenId }).sort({ createdAt: 1 });
  return role ? filterFeedbackForRole(feedback, role) : feedback;
}

// Role scoping here is a view-scoping convenience shared with the screen-detail
// endpoint, applied the same way whether feedback is being read or exported.
export async function buildScreenExport(screenId: string, role?: Role) {
  const screen = await getScreenById(screenId);
  const feedback = await listFeedbackForScreen(screenId, role);

  return {
    screen: {
      id: screen._id,
      imageUrl: screen.imageUrl,
      status: screen.status,
      uploadedAt: screen.uploadedAt,
    },
    feedback: feedback.map((item) => ({
      id: item._id,
      category: item.category,
      severity: item.severity,
      message: item.message,
      coordinates: item.coordinates,
    })),
    role: role ?? null,
    exportedAt: new Date().toISOString(),
  };
}
