'use client';

import { useEffect, useState } from 'react';
import { getStoredName, setStoredName } from './localIdentity';

/**
 * Shared by the top-level comment box and every reply box so "you must have a
 * name to comment" is enforced consistently everywhere, not just on the first one.
 */
export function useCommentIdentity() {
  const [name, setName] = useState('');
  // Independent of `name` itself, so typing into the field doesn't hide it mid-keystroke.
  const [hasStoredName, setHasStoredName] = useState(false);

  useEffect(() => {
    const stored = getStoredName();
    setName(stored);
    setHasStoredName(Boolean(stored));
  }, []);

  function confirmName(): string | null {
    const trimmed = name.trim();
    if (!trimmed) return null;
    setStoredName(trimmed);
    setHasStoredName(true);
    return trimmed;
  }

  return { name, setName, hasStoredName, confirmName };
}
