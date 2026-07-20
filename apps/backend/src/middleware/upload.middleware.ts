import multer from 'multer';
import { AppError } from './errorHandler.middleware';

// Buffers stay in memory only long enough to forward to Cloudinary and Gemini —
// no dependency on a writable/persistent filesystem, which Render's containers don't offer.
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      cb(null, true);
    } else {
      // Thrown as an AppError (not a plain Error) so errorHandler returns the real
      // message as a 400, instead of a generic 500 "Internal server error".
      cb(new AppError(400, 'Only PNG and JPEG images are supported'));
    }
  },
});
