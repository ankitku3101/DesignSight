// components/CommentsThread.tsx
'use client';
import React, { useState } from 'react';

export type CommentType = {
  _id: string;
  author: string;
  message: string;
  createdAt: string;
  replies?: CommentType[];
};

type Props = {
  comments: CommentType[];
  onReply: (parentId: string, msg: string) => void;
};

export default function CommentsThread({ comments, onReply }: Props) {
  return (
    <ul className="ml-3 border-l border-border/60">
      {comments.map(c => (
        <CommentNode key={c._id} comment={c} onReply={onReply} />
      ))}
    </ul>
  );
}

function CommentNode({ comment, onReply }: { comment: CommentType; onReply: (id: string, msg: string) => void }) {
  const [reply, setReply] = useState('');
  const [show, setShow] = useState(false);

  return (
    <li className="mb-3">
      <div className="pl-3">
        <div className="flex items-center gap-2">
          <strong className="text-sm">{comment.author}</strong>
          <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</span>
        </div>
        <p className="text-sm mt-1">{comment.message}</p>
        <button onClick={() => setShow(s => !s)} className="mt-1 text-xs text-muted-foreground hover:text-foreground">Reply</button>
        {show && (
          <form
            onSubmit={e => {
              e.preventDefault();
              if (reply.trim()) onReply(comment._id, reply);
              setReply('');
              setShow(false);
            }}
          >
            <input value={reply} onChange={e => setReply(e.target.value)} className="border border-input bg-background p-1 text-xs rounded" />
            <button type="submit" className="text-xs ml-1 rounded border border-input px-2 py-1 hover:bg-muted/60">Send</button>
          </form>
        )}
      </div>
      {comment.replies && <CommentsThread comments={comment.replies} onReply={onReply} />}
    </li>
  );
}
