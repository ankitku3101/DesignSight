'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { analyzeScreen, uploadScreen } from '@/lib/api';
import type { ScreenSummary } from '@/lib/types';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg'];

export function UploadPanel() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [projectName, setProjectName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uploadedScreen, setUploadedScreen] = useState<ScreenSummary | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  // Revokes the previous blob URL whenever it's replaced or the component unmounts —
  // createObjectURL leaks memory otherwise, since each call pins the file's bytes.
  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  function selectFile(selected: File | null) {
    if (!selected) return;
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      toast.error('Only PNG and JPEG images are supported');
      return;
    }
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setUploadedScreen(null);
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    try {
      const { screen } = await uploadScreen(file, projectName);
      setUploadedScreen(screen);
      toast.success('Screenshot uploaded — ready to analyze');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleAnalyze() {
    if (!uploadedScreen) return;
    setAnalyzing(true);
    try {
      const { screen } = await analyzeScreen(uploadedScreen._id);
      if (screen.status === 'failed') {
        toast.error(screen.error ?? 'Analysis failed');
        setUploadedScreen(screen);
        return;
      }
      router.push(`/screens/${screen._id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">
      {/* Left: upload controls — 60% */}
      <Card>
        <CardContent className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="project-name" className="text-sm font-medium">
              Project name
            </label>
            <Input
              id="project-name"
              placeholder="Optional — leave blank for an auto-generated name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              disabled={uploading || Boolean(uploadedScreen)}
            />
          </div>

          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingOver(true);
            }}
            onDragLeave={() => setIsDraggingOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingOver(false);
              selectFile(e.dataTransfer.files[0] ?? null);
            }}
            className={cn(
              'flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors',
              isDraggingOver ? 'border-ring bg-accent/40' : 'border-border hover:bg-accent/20',
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES.join(',')}
              className="hidden"
              onChange={(e) => selectFile(e.target.files?.[0] ?? null)}
            />
            <UploadCloud className="size-8 text-muted-foreground" />
            <div className="text-sm">
              <span className="font-medium">Click to choose a screenshot</span>
              <span className="text-muted-foreground"> or drag and drop — PNG or JPG</span>
            </div>
            {file && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <ImageIcon className="size-3.5" />
                {file.name}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleUpload}
              disabled={!file || uploading || Boolean(uploadedScreen)}
              className="flex-1 cursor-pointer"
            >
              {uploading && <Loader2 className="size-4 animate-spin" />}
              {uploadedScreen ? 'Uploaded' : 'Upload'}
            </Button>
            <Button
              onClick={handleAnalyze}
              disabled={!uploadedScreen || analyzing}
              variant="secondary"
              className="flex-1 cursor-pointer"
            >
              {analyzing && <Loader2 className="size-4 animate-spin" />}
              Analyze
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Right: preview — 40% */}
      <Card>
        <CardContent className="flex items-center justify-center min-h-[280px]">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Selected screenshot preview"
              className="max-h-80 w-full rounded-md border border-border object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-center text-muted-foreground">
              <ImageIcon className="size-12 opacity-40" />
              <p className="text-sm">Your uploaded screenshot will appear here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
