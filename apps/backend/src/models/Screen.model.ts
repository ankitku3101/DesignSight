import { Schema, model, models, Types, type Model } from 'mongoose';

// 'uploaded': image stored, analysis not yet requested (kept separate from 'processing' so
// a paid Gemini call only ever fires on an explicit user action, never as a side effect of upload).
export type ScreenStatus = 'uploaded' | 'processing' | 'analyzed' | 'failed';

export interface ScreenDocument {
  projectId: Types.ObjectId;
  imageUrl: string;
  imagePublicId: string;
  imageMimeType: string;
  imageWidth: number;
  imageHeight: number;
  status: ScreenStatus;
  error: string | null;
  uploadedAt: Date;
}

const screenSchema = new Schema<ScreenDocument>({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  imageUrl: { type: String, required: true },
  imagePublicId: { type: String, required: true },
  imageMimeType: { type: String, required: true },
  imageWidth: { type: Number, required: true },
  imageHeight: { type: Number, required: true },
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'analyzed', 'failed'],
    default: 'uploaded',
  },
  error: { type: String, default: null },
  uploadedAt: { type: Date, default: Date.now },
});

export const Screen =
  (models.Screen as Model<ScreenDocument>) || model<ScreenDocument>('Screen', screenSchema);
