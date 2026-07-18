import { Schema, model, models, Types, type Model } from 'mongoose';
import { ROLES, type Role } from 'designsight-shared';

// No user accounts — identity is self-declared per comment (name + role picked once per
// browser session and remembered client-side), the same way commenting on a shared link works.
export interface CommentDocument {
  feedbackId: Types.ObjectId;
  parentCommentId: Types.ObjectId | null;
  authorName: string;
  authorRole: Role;
  message: string;
  createdAt: Date;
  editedAt: Date | null;
  deletedAt: Date | null;
}

const commentSchema = new Schema<CommentDocument>({
  feedbackId: { type: Schema.Types.ObjectId, ref: 'Feedback', required: true, index: true },
  parentCommentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null, index: true },
  authorName: { type: String, required: true, trim: true, maxlength: 80 },
  authorRole: { type: String, enum: ROLES, required: true },
  message: { type: String, required: true, trim: true, maxlength: 2000 },
  createdAt: { type: Date, default: Date.now },
  editedAt: { type: Date, default: null },
  // Soft delete: keeps the thread structure intact so replies aren't orphaned.
  deletedAt: { type: Date, default: null },
});

export const Comment =
  (models.Comment as Model<CommentDocument>) || model<CommentDocument>('Comment', commentSchema);
