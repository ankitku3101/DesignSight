'use client';

import { useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CommentThread } from '@/components/CommentThread';
import { cn } from '@/lib/utils';
import { CATEGORY_LABEL, SEVERITY_VARIANT } from '@/lib/feedbackStyle';
import type { FeedbackItemResponse } from '@/lib/types';
import type { Role } from 'designsight-shared';

interface FeedbackListProps {
  items: FeedbackItemResponse[];
  activeFeedbackId: string | null;
  onSelect: (id: string) => void;
  role: Role;
}

export function FeedbackList({ items, activeFeedbackId, onSelect, role }: FeedbackListProps) {
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (!activeFeedbackId) return;
    cardRefs.current.get(activeFeedbackId)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [activeFeedbackId]);

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No feedback for this role.</p>;
  }

  return (
    // A masonry-style column layout, not a row grid — cards naturally vary in
    // height with content length, and forcing them to match by truncating text
    // hides real feedback. Columns let uneven heights look intentional instead.
    <div className="columns-1 sm:columns-2 xl:columns-3 gap-4">
      {items.map((item) => (
        <Card
          key={item._id}
          ref={(el) => {
            if (el) cardRefs.current.set(item._id, el);
            else cardRefs.current.delete(item._id);
          }}
          className={cn(
            'mb-4 break-inside-avoid transition-shadow',
            item._id === activeFeedbackId && 'ring-2 ring-ring',
          )}
        >
          <CardContent className="space-y-2">
            <div
              role="button"
              tabIndex={0}
              onClick={() => onSelect(item._id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onSelect(item._id);
              }}
              className="cursor-pointer space-y-2"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <Badge>{CATEGORY_LABEL[item.category]}</Badge>
                <Badge variant={SEVERITY_VARIANT[item.severity]} className="capitalize">
                  {item.severity}
                </Badge>
              </div>
              <p className="text-sm">{item.message}</p>
            </div>
            <CommentThread feedbackId={item._id} role={role} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
