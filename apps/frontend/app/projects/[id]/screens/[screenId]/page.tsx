'use client';
import { use, useEffect, useState } from 'react';
import { CommentType } from '@/components/CommentsThread';
import ExportButton from '@/components/ExportButton';
import FeedbackItemCard from '@/components/FeedbackItemCard';
import RoleSwitcher from '@/components/RoleSwitcher';

type FeedbackItem = {
  _id?: string;
  type: string;
  message: string;
  coordinates?: { x: number; y: number; w: number; h: number } | null;
  comments?: CommentType[];
};

type ScreenType = {
  _id: string;
  imageUrl: string;
  feedbackItems: FeedbackItem[];
  geminiSuggestions?: FeedbackItem[];
};

const API_URL = process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:5000';

type Role = 'designer' | 'reviewer' | 'product_manager' | 'developer';

type PageProps = {
  params: Promise<{ id: string; screenId: string }>;
};

export default function ScreenDetailPage({ params }: PageProps) {
  const { id, screenId } = use(params);

  const [screen, setScreen] = useState<ScreenType | null>(null);
  const [role, setRole] = useState<Role>('designer');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setError(null);
    setScreen(null);

    fetch(`${API_URL}/api/projects/${id}/screens/${screenId}`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch screen: ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        if (isMounted) setScreen(data.screen);
      })
      .catch(err => {
        if (isMounted) setError(err.message || 'Error loading screen data');
      });

    return () => {
      isMounted = false;
    };
  }, [id, screenId]);

  if (error) return <div className="text-red-600 p-4">Error: {error}</div>;
  if (!screen) return <div className="p-4">Loading…</div>;

  const roleTypeMap: Record<Role, string[]> = {
    designer: ['accessibility', 'visual-hierarchy'],
    reviewer: ['content', 'visual-hierarchy'],
    product_manager: ['content', 'ui-ux'],
    developer: ['ui-ux'],
  };

  const visionFiltered =
    screen.feedbackItems?.filter(f =>
      roleTypeMap[role]?.includes(f.type)
    ) || [];

  const geminiFiltered =
    screen.geminiSuggestions?.filter(f =>
      roleTypeMap[role]?.includes(f.type)
    ) || [];

  return (
    <div className="container mx-auto p-4">
      <h2 className="font-bold text-xl mb-1">Screen Feedback</h2>
      <RoleSwitcher value={role} onChange={(r: string) => setRole(r as Role)} />

      <div className="flex flex-col md:flex-row gap-6 mt-5">
        {/* LEFT: Image & Export */}
        <div className="flex-1">
          <img
            src={screen.imageUrl}
            alt="Screen"
            className="rounded border mb-3 max-w-full shadow"
          />
          <ExportButton screenId={screen._id} />
        </div>

        {/* RIGHT: Feedback */}
        <div className="flex-1 space-y-6">
          {/* Vision Feedback */}
          <div>
            <h3 className="font-semibold text-lg mb-2 text-gray-800">Vision Feedback</h3>
            {visionFiltered.length === 0 ? (
              <div className="text-gray-500">No Vision feedback for this role.</div>
            ) : (
              visionFiltered.map((item, idx) => (
                <FeedbackItemCard
                  key={item._id || `vision-${idx}`}
                  item={item as Required<FeedbackItem>}
                  screenId={screen._id}
                />
              ))
            )}
          </div>

          {/* Gemini Suggestions */}
          {geminiFiltered.length > 0 && (
            <div className="p-5 border rounded-lg bg-gray-50 shadow-sm">
              <h3 className="font-semibold text-lg mb-3 text-gray-800">AI Suggestions</h3>
              {geminiFiltered.map((item, idx) => (
                <FeedbackItemCard
                  key={item._id || `gemini-${idx}`}
                  item={item as Required<FeedbackItem>}
                  screenId={screen._id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
