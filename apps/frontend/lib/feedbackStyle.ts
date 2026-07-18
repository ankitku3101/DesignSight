import type { FeedbackCategory, FeedbackSeverity } from 'designsight-shared';

export const CATEGORY_LABEL: Record<FeedbackCategory, string> = {
  accessibility: 'Accessibility',
  'visual-hierarchy': 'Visual Hierarchy',
  content: 'Content',
  'ui-ux': 'UI/UX',
};

// Category -> border/accent color, shared between the feedback list and the
// bounding-box overlay so a category reads the same way in both places.
export const CATEGORY_COLOR: Record<FeedbackCategory, string> = {
  accessibility: '#3b82f6',
  'visual-hierarchy': '#a855f7',
  content: '#f59e0b',
  'ui-ux': '#22c55e',
};

export const SEVERITY_VARIANT: Record<FeedbackSeverity, 'outline' | 'secondary' | 'destructive'> = {
  low: 'outline',
  medium: 'secondary',
  high: 'destructive',
};
