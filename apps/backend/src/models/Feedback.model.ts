import { Schema, model, models, Types, type Model } from 'mongoose';
import {
  FEEDBACK_CATEGORIES,
  FEEDBACK_SEVERITIES,
  type FeedbackCategory,
  type FeedbackSeverity,
  type NormalizedCoordinates,
} from 'designsight-shared';

export interface FeedbackDocument {
  screenId: Types.ObjectId;
  category: FeedbackCategory;
  severity: FeedbackSeverity;
  message: string;
  // Normalized 0-1 bounding box, or null when the feedback isn't tied to a specific region.
  coordinates: NormalizedCoordinates | null;
  createdAt: Date;
}

const feedbackSchema = new Schema<FeedbackDocument>({
  screenId: { type: Schema.Types.ObjectId, ref: 'Screen', required: true, index: true },
  category: { type: String, enum: FEEDBACK_CATEGORIES, required: true, index: true },
  severity: { type: String, enum: FEEDBACK_SEVERITIES, required: true },
  message: { type: String, required: true },
  coordinates: {
    type: new Schema({ x: Number, y: Number, w: Number, h: Number }, { _id: false }),
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
});

export const Feedback =
  (models.Feedback as Model<FeedbackDocument>) ||
  model<FeedbackDocument>('Feedback', feedbackSchema);
