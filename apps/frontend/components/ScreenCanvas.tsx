'use client';

import { useEffect, useRef, useState } from 'react';
import { CATEGORY_COLOR } from '@/lib/feedbackStyle';
import type { FeedbackItemResponse } from '@/lib/types';

interface ScreenCanvasProps {
  imageUrl: string;
  feedback: FeedbackItemResponse[];
  activeFeedbackId: string | null;
  onActivate: (id: string) => void;
}

export function ScreenCanvas({ imageUrl, feedback, activeFeedbackId, onActivate }: ScreenCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Boxes are positioned from the actual rendered size, not the image's natural
  // dimensions, so they track correctly across responsive breakpoints for free.
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const positioned = feedback.filter((item) => item.coordinates);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt="Uploaded screen"
        className="block w-full rounded-lg border border-border"
      />
      {positioned.map((item) => {
        const { x, y, w, h } = item.coordinates!;
        const isActive = item._id === activeFeedbackId;
        const color = CATEGORY_COLOR[item.category];
        return (
          <button
            key={item._id}
            type="button"
            onClick={() => onActivate(item._id)}
            onFocus={() => onActivate(item._id)}
            aria-label={`${item.category} feedback: ${item.message}`}
            className="absolute rounded-sm outline-none transition-[border-width,box-shadow]"
            style={{
              left: x * size.width,
              top: y * size.height,
              width: w * size.width,
              height: h * size.height,
              borderWidth: isActive ? 3 : 2,
              borderStyle: 'solid',
              borderColor: color,
              backgroundColor: isActive ? `${color}33` : `${color}14`,
              boxShadow: isActive ? `0 0 0 2px ${color}55` : undefined,
            }}
          />
        );
      })}
    </div>
  );
}
