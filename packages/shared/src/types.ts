export const ROLES = ['designer', 'reviewer', 'product_manager', 'developer'] as const;
export type Role = (typeof ROLES)[number];

export const FEEDBACK_CATEGORIES = [
  'accessibility',
  'visual-hierarchy',
  'content',
  'ui-ux',
] as const;
export type FeedbackCategory = (typeof FEEDBACK_CATEGORIES)[number];

export const FEEDBACK_SEVERITIES = ['low', 'medium', 'high'] as const;
export type FeedbackSeverity = (typeof FEEDBACK_SEVERITIES)[number];

/** Normalized 0-1 bounding box, relative to the image's natural width/height. */
export interface NormalizedCoordinates {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface FeedbackItem {
  id: string;
  screenId: string;
  category: FeedbackCategory;
  severity: FeedbackSeverity;
  message: string;
  coordinates: NormalizedCoordinates | null;
  createdAt: string;
}
