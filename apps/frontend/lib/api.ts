import type { FeedbackItemResponse, ProjectRef, ScreenSummary } from './types';

const API_URL = process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:5000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, init);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Request failed with status ${res.status}`);
  }
  return res.json();
}

export function uploadScreen(
  file: File,
  projectName: string,
): Promise<{ screen: ScreenSummary; project: ProjectRef }> {
  const formData = new FormData();
  formData.append('image', file);
  if (projectName.trim()) formData.append('projectName', projectName.trim());
  return request('/api/screens', { method: 'POST', body: formData });
}

export function analyzeScreen(
  screenId: string,
): Promise<{ screen: ScreenSummary; feedback: FeedbackItemResponse[] }> {
  return request(`/api/screens/${screenId}/analyze`, { method: 'POST' });
}

export function listRecentScreens(): Promise<ScreenSummary[]> {
  return request('/api/screens');
}

export function getScreen(
  screenId: string,
): Promise<{ screen: ScreenSummary; feedback: FeedbackItemResponse[] }> {
  return request(`/api/screens/${screenId}`);
}
