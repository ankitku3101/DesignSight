'use client';

import { useEffect, useState } from 'react';
import { Loader2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createComment, listComments } from '@/lib/api';
import { useCommentIdentity } from '@/lib/useCommentIdentity';
import type { CommentNode } from '@/lib/types';
import type { Role } from 'designsight-shared';

function initials(name: string) {
  return name.trim().slice(0, 2).toUpperCase() || '?';
}

function roleLabel(role: Role) {
  return role.replace('_', ' ');
}

function CommentNodeView({
  node,
  feedbackId,
  role,
  onPosted,
}: {
  node: CommentNode;
  feedbackId: string;
  role: Role;
  onPosted: () => void;
}) {
  const [replying, setReplying] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { name, setName, hasStoredName, confirmName } = useCommentIdentity();

  async function submitReply() {
    if (!message.trim()) return;
    const authorName = confirmName();
    if (!authorName) {
      toast.error('Enter your name to comment');
      return;
    }
    setSubmitting(true);
    try {
      await createComment(feedbackId, {
        message: message.trim(),
        authorName,
        authorRole: role,
        parentCommentId: node._id,
      });
      setMessage('');
      setReplying(false);
      onPosted();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Avatar className="size-6">
          <AvatarFallback className="text-[10px]">{initials(node.authorName)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">{node.authorName}</span>
            <Badge variant="outline" className="text-[10px] capitalize">
              {roleLabel(node.authorRole)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{node.message}</p>
          {!node.deletedAt && (
            <button
              type="button"
              onClick={() => setReplying((v) => !v)}
              className="text-xs text-muted-foreground hover:text-foreground mt-1 cursor-pointer"
            >
              Reply
            </button>
          )}
          {replying && (
            <div className="space-y-2 mt-2">
              {!hasStoredName && (
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="h-8 text-sm"
                />
              )}
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a reply…"
                  className="h-8 text-sm"
                />
                <Button size="sm" onClick={submitReply} disabled={submitting}>
                  {submitting && <Loader2 className="size-3.5 animate-spin" />}
                  Reply
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {node.children.length > 0 && (
        <div className="ml-8 space-y-3 border-l border-border pl-4">
          {node.children.map((child) => (
            <CommentNodeView key={child._id} node={child} feedbackId={feedbackId} role={role} onPosted={onPosted} />
          ))}
        </div>
      )}
    </div>
  );
}

export function CommentThread({ feedbackId, role }: { feedbackId: string; role: Role }) {
  const [comments, setComments] = useState<CommentNode[] | null>(null);
  // Collapsed by default — an expanding thread was the main reason cards in the
  // grid ended up wildly different heights, so nothing but the toggle shows until clicked.
  const [expanded, setExpanded] = useState(false);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { name, setName, hasStoredName, confirmName } = useCommentIdentity();

  function load() {
    listComments(feedbackId)
      .then(setComments)
      .catch(() => setComments([]));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedbackId]);

  async function submitTopLevel() {
    if (!message.trim()) return;
    const authorName = confirmName();
    if (!authorName) {
      toast.error('Enter your name to comment');
      return;
    }
    setSubmitting(true);
    try {
      await createComment(feedbackId, {
        message: message.trim(),
        authorName,
        authorRole: role,
      });
      setMessage('');
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="pt-3 border-t border-border">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
      >
        <MessageSquare className="size-3.5" />
        {comments?.length ?? 0} comment{comments?.length === 1 ? '' : 's'}
      </button>

      {expanded && (
        <div className="space-y-3 mt-3">
          {comments?.map((node) => (
            <CommentNodeView key={node._id} node={node} feedbackId={feedbackId} role={role} onPosted={load} />
          ))}

          <div className="space-y-2">
            {!hasStoredName && (
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="h-8 text-sm"
              />
            )}
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Comment as ${roleLabel(role)}…`}
                className="h-8 text-sm"
              />
              <Button size="sm" onClick={submitTopLevel} disabled={submitting}>
                {submitting && <Loader2 className="size-3.5 animate-spin" />}
                Post
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
