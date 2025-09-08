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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Screen Feedback</h2>
          <p className="text-sm text-muted-foreground">Review automated insights and AI suggestions.</p>
        </div>
        <RoleSwitcher value={role} onChange={(r: string) => setRole(r as Role)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Image */}
        <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
          <img
            src={screen.imageUrl}
            alt="Screen"
            className="rounded-lg border border-border/70 w-full max-w-full shadow-sm"
          />
          <div className="flex items-center justify-end">
            <ExportButton screenId={screen._id} />
          </div>
        </div>

        {/* Card 2: Coordinates list */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="font-semibold text-lg mb-3">Regions Referenced</h3>
          {(() => {
            const itemsWithCoords = [
              ...(visionFiltered || []),
              ...(geminiFiltered || []),
            ].filter((i) => i.coordinates);
            if (itemsWithCoords.length === 0) {
              return <div className="text-sm text-muted-foreground">No regions specified.</div>;
            }
            return (
              <ul className="space-y-2 text-sm">
                {itemsWithCoords.map((i, idx) => (
                  <li key={i._id || `coords-${idx}`} className="rounded border border-border/70 p-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium capitalize">{i.type}</span>
                      <span className="text-xs text-muted-foreground">{i._id?.slice(-6) || `#${idx + 1}`}</span>
                    </div>
                    <div className="mt-1 grid grid-cols-4 gap-2">
                      <span><span className="text-muted-foreground">x:</span> {i.coordinates!.x}</span>
                      <span><span className="text-muted-foreground">y:</span> {i.coordinates!.y}</span>
                      <span><span className="text-muted-foreground">w:</span> {i.coordinates!.w}</span>
                      <span><span className="text-muted-foreground">h:</span> {i.coordinates!.h}</span>
                    </div>
                    <p className="mt-1 text-muted-foreground line-clamp-2">{i.message}</p>
                  </li>
                ))}
              </ul>
            );
          })()}
        </div>

        {/* Card 3: Vision Feedback */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="font-semibold text-lg mb-3">Vision Feedback</h3>
          {visionFiltered.length === 0 ? (
            <div className="text-sm text-muted-foreground">No Vision feedback for this role.</div>
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

        {/* Card 4: AI Suggestions */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="font-semibold text-lg mb-3">AI Suggestions</h3>
          {geminiFiltered.length === 0 ? (
            <div className="text-sm text-muted-foreground">No AI suggestions for this role.</div>
          ) : (
            geminiFiltered.map((item, idx) => (
              <FeedbackItemCard
                key={item._id || `gemini-${idx}`}
                item={item as Required<FeedbackItem>}
                screenId={screen._id}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
