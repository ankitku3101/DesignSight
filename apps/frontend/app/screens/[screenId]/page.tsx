'use client';

import { use, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FeedbackList } from '@/components/FeedbackList';
import { analyzeScreen, getScreen } from '@/lib/api';
import type { FeedbackItemResponse, ScreenSummary } from '@/lib/types';

type PageProps = {
  params: Promise<{ screenId: string }>;
};

export default function ScreenDetailPage({ params }: PageProps) {
  const { screenId } = use(params);

  const [screen, setScreen] = useState<ScreenSummary | null>(null);
  const [feedback, setFeedback] = useState<FeedbackItemResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function load() {
    getScreen(screenId)
      .then((data) => {
        setScreen(data.screen);
        setFeedback(data.feedback);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load screen'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenId]);

  async function handleAnalyze() {
    setAnalyzing(true);
    try {
      const { screen: updated, feedback: updatedFeedback } = await analyzeScreen(screenId);
      setScreen(updated);
      setFeedback(updatedFeedback);
      if (updated.status === 'failed') toast.error(updated.error ?? 'Analysis failed');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="aspect-video rounded-xl" />
        <Skeleton className="aspect-video rounded-xl" />
      </div>
    );
  }

  if (error || !screen) {
    return <p className="text-sm text-destructive">{error ?? 'Screen not found'}</p>;
  }

  const projectName = typeof screen.projectId === 'string' ? null : screen.projectId.name;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {projectName ?? 'Screen'}
          </h1>
          <p className="text-sm text-muted-foreground">Uploaded {new Date(screen.uploadedAt).toLocaleString()}</p>
        </div>
        <Badge variant="outline" className="capitalize w-fit">
          {screen.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={screen.imageUrl}
            alt="Uploaded screen"
            className="w-full rounded-lg border border-border"
          />
        </Card>

        <div className="space-y-4">
          {screen.status === 'uploaded' && (
            <div className="rounded-lg border border-dashed border-border p-6 text-center space-y-3">
              <p className="text-sm text-muted-foreground">Not analyzed yet.</p>
              <Button onClick={handleAnalyze} disabled={analyzing}>
                {analyzing && <Loader2 className="size-4 animate-spin" />}
                Analyze
              </Button>
            </div>
          )}

          {screen.status === 'processing' && (
            <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin mx-auto mb-2" />
              Analyzing…
            </div>
          )}

          {screen.status === 'failed' && (
            <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 space-y-3">
              <p className="text-sm text-destructive">{screen.error}</p>
              <Button onClick={handleAnalyze} disabled={analyzing} variant="secondary">
                {analyzing && <Loader2 className="size-4 animate-spin" />}
                Retry analysis
              </Button>
            </div>
          )}

          {screen.status === 'analyzed' && <FeedbackList items={feedback} />}
        </div>
      </div>
    </div>
  );
}
