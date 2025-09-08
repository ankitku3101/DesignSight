// components/ImageUploader.tsx
'use client';
import React, { useState } from 'react';

type Props = { projectId: string; onUploaded?: () => void };
const API_URL = process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:5000';

export default function ImageUploader({ projectId, onUploaded }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${API_URL}/api/projects/${projectId}/screens`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      setFile(null);
      onUploaded?.();
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2 sm:flex-row sm:items-center">
      <input type="file" accept="image/png,image/jpeg" onChange={e => setFile(e.target.files?.[0] ?? null)} disabled={loading} />
      <button type="submit" disabled={loading || !file} className="bg-green-600 text-white px-3 py-1 rounded">Upload & Analyze</button>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </form>
  );
}
