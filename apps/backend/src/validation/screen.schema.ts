import { z } from 'zod';

export const uploadScreenSchema = z.object({
  projectName: z.string().trim().max(200).optional(),
});
