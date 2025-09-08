// components/FeedbackItemCard.tsx
'use client';
import CommentsThread, { CommentType } from '@/components/CommentsThread';

type Props = {
  item: {
    _id: string;
    type: string;
    message: string;
    coordinates?: { x: number; y: number; w: number; h: number } | null;
    comments?: CommentType[];
  };
  screenId: string;
};
export default function FeedbackItemCard({ item, screenId }: Props) {
  // handleReply would POST to `/api/screens/:screenId/feedback/:feedbackId/comments`
  const handleReply = async (parentId: string, message: string) => {
    // Add POST logic here
  };

  return (
    <div className="border border-gray-200 rounded-lg mb-4 p-4 bg-white shadow-sm">
      <div className="flex items-start gap-2">
        <span
          className={
            `px-2 py-0.5 rounded text-xs font-medium mt-0.5 ` +
            (item.type === 'accessibility'
              ? 'bg-blue-50 text-blue-700 border border-blue-200'
              : item.type === 'visual-hierarchy'
              ? 'bg-purple-50 text-purple-700 border border-purple-200'
              : item.type === 'content'
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200')
          }
        >
          {item.type}
        </span>
        <p className="text-gray-800 leading-relaxed">{item.message}</p>
      </div>
      <div className="mt-3">
        <CommentsThread comments={item.comments || []} onReply={handleReply} />
      </div>
    </div>
  );
}
