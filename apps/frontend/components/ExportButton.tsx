import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Role } from 'designsight-shared';

const API_URL = process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:5000';

// A plain anchor, not next/link — this points at the backend's origin and relies on
// its Content-Disposition header to trigger a download, not client-side routing.
export function ExportButton({ screenId, role }: { screenId: string; role: Role }) {
  const href = `${API_URL}/api/screens/${screenId}/export?role=${role}`;
  return (
    <Button asChild variant="outline" size="sm">
      <a href={href} download>
        <Download className="size-3.5" />
        Export JSON
      </a>
    </Button>
  );
}
