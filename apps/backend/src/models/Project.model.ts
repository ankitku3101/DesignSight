import { Schema, model, models, type Model } from 'mongoose';

export interface ProjectDocument {
  name: string;
  createdAt: Date;
}

const projectSchema = new Schema<ProjectDocument>({
  name: { type: String, required: true, unique: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

// mongoose.models is untyped, so it's cast before the `||` — otherwise TS unions it with
// the typed model() overloads and can no longer resolve which overload applies.
export const Project =
  (models.Project as Model<ProjectDocument>) || model<ProjectDocument>('Project', projectSchema);
