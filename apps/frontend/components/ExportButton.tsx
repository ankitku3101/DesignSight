// components/ExportButton.tsx
'use client';
type Props = { screenId: string };
const API_URL = process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:5000';

export default function ExportButton({ screenId }: Props) {
  async function exportJson() {
    const res = await fetch(`${API_URL}/api/screens/${screenId}/export`);
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `feedback-${screenId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <button onClick={exportJson} className="mt-3 inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-muted/60 transition">
      Export Feedback (JSON)
    </button>
  );
}
