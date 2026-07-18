'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    /* Placeholder keeps layout stable before hydration */
    return (
      <span className="h-8 w-8 rounded-md inline-flex items-center justify-center" aria-hidden="true" />
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="h-8 w-8 rounded-md inline-flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <Sun size={15} strokeWidth={1.75} />
      ) : (
        <Moon size={15} strokeWidth={1.75} />
      )}
    </button>
  );
}
