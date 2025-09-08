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
    <ul className="ml-3 border-l">
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
    <li className="mb-2">
      <div>
        <strong>{comment.author}</strong> <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
        <p>{comment.message}</p>
        <button onClick={() => setShow(s => !s)} className="text-xs">Reply</button>
        {show && (
          <form
            onSubmit={e => {
              e.preventDefault();
              if (reply.trim()) onReply(comment._id, reply);
              setReply('');
              setShow(false);
            }}
          >
            <input value={reply} onChange={e => setReply(e.target.value)} className="border p-1 text-xs" />
            <button type="submit" className="text-xs ml-1">Send</button>
          </form>
        )}
      </div>
      {comment.replies && <CommentsThread comments={comment.replies} onReply={onReply} />}
    </li>
  );
}
