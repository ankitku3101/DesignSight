import { z } from 'zod';
import { ROLES } from 'designsight-shared';

export const uploadScreenSchema = z.object({
  projectName: z.string().trim().max(200).optional(),
});

// Role is a view-scoping convenience (see designsight-shared/roleFilters), not an
// authorization boundary — there is no auth in v1.
export const roleQuerySchema = z.object({
  role: z.enum(ROLES).optional(),
});
