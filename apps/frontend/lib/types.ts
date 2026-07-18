import type { FeedbackCategory, FeedbackSeverity, NormalizedCoordinates } from 'designsight-shared';

export type ScreenStatus = 'uploaded' | 'processing' | 'analyzed' | 'failed';

export interface ProjectRef {
  _id: string;
  name: string;
}

export interface ScreenSummary {
  _id: string;
  projectId: ProjectRef | string;
  imageUrl: string;
  imagePublicId: string;
  imageMimeType: string;
  imageWidth: number;
  imageHeight: number;
  status: ScreenStatus;
  error: string | null;
  uploadedAt: string;
}

export interface FeedbackItemResponse {
  _id: string;
  screenId: string;
  category: FeedbackCategory;
  severity: FeedbackSeverity;
  message: string;
  coordinates: NormalizedCoordinates | null;
  createdAt: string;
}
