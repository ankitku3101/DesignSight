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
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">DesignSight – Screens</h1>
      <ImageUploader projectId={id} onUploaded={fetchScreens} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mt-6">
        {screens.map((screen) => (
          <div key={screen._id} className="shadow rounded border p-2">
            <img src={screen.imageUrl} alt="" className="w-full aspect-video object-cover rounded border" />
            <Link href={`/projects/${id}/screens/${screen._id}`}>
              <button className="w-full mt-2 bg-blue-600 text-white rounded py-1">View Feedback</button>
            </Link>
          </div>
        ))}
        {fetching && <div>Loading…</div>}
      </div>
    </div>
  );
}