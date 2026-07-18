import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { FEEDBACK_CATEGORIES, FEEDBACK_SEVERITIES } from 'designsight-shared';
import { env } from '../../config/env';
import { SYSTEM_PROMPT } from './prompt';

const google = createGoogleGenerativeAI({ apiKey: env.GEMINI_API_KEY });

const coordinatesSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  w: z.number().min(0).max(1),
  h: z.number().min(0).max(1),
});

const feedbackItemSchema = z.object({
  category: z.enum(FEEDBACK_CATEGORIES),
  severity: z.enum(FEEDBACK_SEVERITIES),
  message: z.string().min(1),
  coordinates: coordinatesSchema.nullable(),
});

const analysisResultSchema = z.object({
  feedback: z.array(feedbackItemSchema),
});

export type AnalyzedFeedbackItem = z.infer<typeof feedbackItemSchema>;

export async function analyzeScreen(
  imageBuffer: Buffer,
  mimeType: string,
): Promise<AnalyzedFeedbackItem[]> {
  const { object } = await generateObject({
    model: google(env.GEMINI_MODEL),
    schema: analysisResultSchema,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Analyze this design screenshot and return structured feedback.' },
          { type: 'image', image: imageBuffer, mediaType: mimeType },
        ],
      },
    ],
  });
  return object.feedback;
}
