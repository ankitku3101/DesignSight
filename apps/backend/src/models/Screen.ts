import mongoose from 'mongoose';

const screenSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  imageUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export const Screen = mongoose.model('Screen', screenSchema);