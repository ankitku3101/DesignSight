// app/projects/[id]/screens/page.tsx
'use client';
import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import ImageUploader from '@/components/ImageUploader';

type ScreenType = {
  _id: string;
  imageUrl: string;
};

const API_URL = process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:5000';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function ScreensPage({ params }: PageProps) {
  // unwrap the Promise
  const { id } = use(params);
  
  const [screens, setScreens] = useState<ScreenType[]>([]);
  const [fetching, setFetching] = useState(false);

  const fetchScreens = async () => {
    setFetching(true);
    const res = await fetch(`${API_URL}/api/projects/${id}/screens`);
    const data = await res.json();
    setScreens(data.screens || []);
    setFetching(false);
  };

  useEffect(() => {
    fetchScreens();
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Screens</h1>
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <ImageUploader projectId={id} onUploaded={fetchScreens} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {screens.map((screen) => (
          <div key={screen._id} className="group rounded-xl border border-border overflow-hidden bg-card hover:shadow-sm transition">
            <img src={screen.imageUrl} alt="" className="w-full aspect-video object-cover" />
            <div className="p-3">
              <Link href={`/projects/${id}/screens/${screen._id}`} className="inline-flex w-full items-center justify-center rounded-md bg-foreground text-background px-3 py-2 text-sm font-medium hover:opacity-90 transition">
                View Feedback
              </Link>
            </div>
          </div>
        ))}
        {fetching && <div className="text-sm text-muted-foreground">Loading…</div>}
      </div>
    </div>
  );
}