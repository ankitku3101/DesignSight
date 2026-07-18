import { Schema, model, models, Types, type Model } from 'mongoose';

export type ScreenStatus = 'processing' | 'analyzed' | 'failed';

export interface ScreenDocument {
  projectId: Types.ObjectId;
  imageUrl: string;
  imagePublicId: string;
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
  imageWidth: { type: Number, required: true },
  imageHeight: { type: Number, required: true },
  status: { type: String, enum: ['processing', 'analyzed', 'failed'], default: 'processing' },
  error: { type: String, default: null },
  uploadedAt: { type: Date, default: Date.now },
});

export const Screen =
  (models.Screen as Model<ScreenDocument>) || model<ScreenDocument>('Screen', screenSchema);
