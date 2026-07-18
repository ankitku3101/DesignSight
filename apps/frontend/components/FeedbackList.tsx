'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CATEGORY_LABEL, SEVERITY_VARIANT } from '@/lib/feedbackStyle';
import type { FeedbackItemResponse } from '@/lib/types';

export function FeedbackList({ items }: { items: FeedbackItemResponse[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No feedback for this role.</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item._id}>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge>{CATEGORY_LABEL[item.category]}</Badge>
              <Badge variant={SEVERITY_VARIANT[item.severity]} className="capitalize">
                {item.severity}
              </Badge>
            </div>
            <p className="text-sm">{item.message}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
