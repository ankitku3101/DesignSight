import type { FeedbackCategory, Role } from './types';

/**
 * Which feedback categories each role sees by default.
 * This is a view-scoping convenience, not an authorization boundary —
 * there is no auth in v1, so this only shapes what's surfaced, not what's accessible.
 */
export const ROLE_CATEGORY_MAP: Record<Role, FeedbackCategory[]> = {
  designer: ['accessibility', 'visual-hierarchy'],
  reviewer: ['content', 'visual-hierarchy'],
  product_manager: ['content', 'ui-ux'],
  developer: ['ui-ux', 'accessibility'],
};

export function filterFeedbackForRole<T extends { category: FeedbackCategory }>(
  items: T[],
  role: Role,
): T[] {
  const allowed = ROLE_CATEGORY_MAP[role];
  return items.filter((item) => allowed.includes(item.category));
}
