'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { listRecentScreens } from '@/lib/api';
import type { ScreenSummary, ScreenStatus } from '@/lib/types';

const STATUS_VARIANT: Record<ScreenStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  uploaded: 'outline',
  processing: 'secondary',
  analyzed: 'default',
  failed: 'destructive',
};

export function RecentScreens() {
  const [screens, setScreens] = useState<ScreenSummary[] | null>(null);

  useEffect(() => {
    listRecentScreens()
      .then(setScreens)
      .catch(() => setScreens([]));
  }, []);

  if (screens === null) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="aspect-video rounded-lg" />
        ))}
      </div>
    );
  }

  if (screens.length === 0) {
    return <p className="text-sm text-muted-foreground">No screens uploaded yet.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {screens.map((screen) => {
        const projectName =
          typeof screen.projectId === 'string' ? null : screen.projectId.name;
        return (
          <Link
            key={screen._id}
            href={`/screens/${screen._id}`}
            className="group rounded-lg border border-border overflow-hidden bg-card hover:shadow-sm transition-shadow"
          >
            <div className="aspect-video overflow-hidden bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={screen.imageUrl}
                alt=""
                className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
              />
            </div>
            <div className="p-3 space-y-1.5">
              {projectName && (
                <p className="text-sm font-medium truncate">{projectName}</p>
              )}
              <Badge variant={STATUS_VARIANT[screen.status]} className="capitalize">
                {screen.status}
              </Badge>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
