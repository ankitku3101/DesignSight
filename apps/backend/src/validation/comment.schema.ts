import { z } from 'zod';
import { ROLES } from 'designsight-shared';

export const createCommentSchema = z.object({
  message: z.string().trim().min(1, 'Message is required').max(2000),
  authorName: z.string().trim().min(1, 'Name is required').max(80),
  authorRole: z.enum(ROLES),
  parentCommentId: z.string().optional(),
});

export const updateCommentSchema = z.object({
  message: z.string().trim().min(1, 'Message is required').max(2000),
});
