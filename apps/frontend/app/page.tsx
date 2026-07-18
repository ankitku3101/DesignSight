import { UploadPanel } from '@/components/UploadPanel';
import { RecentScreens } from '@/components/RecentScreens';

export default function Home() {
  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Get AI feedback on your screen
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload a screenshot, then analyze it for accessibility, hierarchy, copy, and UX issues.
        </p>
      </div>

      <UploadPanel />

      <div className="space-y-4">
        <h2 className="text-lg font-medium">Recent screens</h2>
        <RecentScreens />
      </div>
    </div>
  );
}
