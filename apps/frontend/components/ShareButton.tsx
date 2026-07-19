'use client';

import { useState } from 'react';
import { Check, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

// Screens are the shareable unit — anyone with this link can view and comment on
// it, no account needed (see the Identity & Sharing Model design decision).
export function ShareButton({ screenId }: { screenId: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const url = `${window.location.origin}/screens/${screenId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Share link copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy link');
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      {copied ? <Check className="size-3.5" /> : <LinkIcon className="size-3.5" />}
      {copied ? 'Copied' : 'Copy link'}
    </Button>
  );
}
