import mongoose from 'mongoose';

// Comment schema
const CommentSchema = new mongoose.Schema({
  author: { type: String, default: 'Anonymous' },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Feedback schema (from Google Vision)
const FeedbackSchema = new mongoose.Schema({
  type: { type: String, required: true }, // 'accessibility' | 'visual-hierarchy' | 'content' | 'ui-ux'
  message: { type: String, required: true },
  coordinates: {
    x: { type: Number, default: null },
    y: { type: Number, default: null },
    w: { type: Number, default: null },
    h: { type: Number, default: null },
  },
  comments: { type: [CommentSchema], default: [] },
});

// Gemini suggestion schema
const GeminiSuggestionSchema = new mongoose.Schema({
  type: { type: String, required: true }, // 'accessibility' | 'visual-hierarchy' | 'content' | 'ui-ux'
  message: { type: String, required: true },
  coordinates: {
    x: { type: Number, default: null },
    y: { type: Number, default: null },
    w: { type: Number, default: null },
    h: { type: Number, default: null },
  },
  createdAt: { type: Date, default: Date.now },
});

// Screen schema
const ScreenSchema = new mongoose.Schema({
  projectId: { type: String, required: true },
  imageUrl: { type: String, required: true },
  feedbackItems: { type: [FeedbackSchema], default: [] },
  geminiSuggestions: { type: [GeminiSuggestionSchema], default: [] }, // updated schema
  uploadedAt: { type: Date, default: Date.now },
});

export const Screen =
  mongoose.models.Screen || mongoose.model('Screen', ScreenSchema);
