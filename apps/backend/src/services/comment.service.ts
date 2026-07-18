import { Comment } from '../models/Comment.model';
import { Feedback } from '../models/Feedback.model';
import { AppError } from '../middleware/errorHandler.middleware';
import type { Role } from 'designsight-shared';

interface CreateCommentInput {
  message: string;
  authorName: string;
  authorRole: Role;
  parentCommentId?: string;
}

export interface CommentNode {
  _id: string;
  feedbackId: string;
  parentCommentId: string | null;
  authorName: string;
  authorRole: Role;
  message: string;
  createdAt: Date;
  editedAt: Date | null;
  deletedAt: Date | null;
  children: CommentNode[];
}

export async function createComment(feedbackId: string, input: CreateCommentInput) {
  const feedback = await Feedback.findById(feedbackId);
  if (!feedback) throw new AppError(404, 'Feedback item not found');

  if (input.parentCommentId) {
    const parent = await Comment.findOne({ _id: input.parentCommentId, feedbackId });
    if (!parent) throw new AppError(404, 'Parent comment not found');
  }

  return Comment.create({
    feedbackId,
    parentCommentId: input.parentCommentId ?? null,
    authorName: input.authorName,
    authorRole: input.authorRole,
    message: input.message,
  });
}

// Single flat query + one pass to build a Map<id, node>, then attach children — O(n),
// no need for a materialized-path or nested-set scheme at this thread depth/scale.
export async function listCommentTree(feedbackId: string): Promise<CommentNode[]> {
  const comments = await Comment.find({ feedbackId }).sort({ createdAt: 1 }).lean();

  const nodeById = new Map<string, CommentNode>();
  for (const comment of comments) {
    nodeById.set(String(comment._id), {
      _id: String(comment._id),
      feedbackId: String(comment.feedbackId),
      parentCommentId: comment.parentCommentId ? String(comment.parentCommentId) : null,
      authorName: comment.authorName,
      authorRole: comment.authorRole,
      // Soft-deleted comments keep their place in the thread so replies aren't orphaned,
      // but their content is replaced for anyone reading the tree.
      message: comment.deletedAt ? '[deleted]' : comment.message,
      createdAt: comment.createdAt,
      editedAt: comment.editedAt,
      deletedAt: comment.deletedAt,
      children: [],
    });
  }

  const roots: CommentNode[] = [];
  for (const node of nodeById.values()) {
    const parent = node.parentCommentId ? nodeById.get(node.parentCommentId) : undefined;
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

export async function updateComment(commentId: string, message: string) {
  const comment = await Comment.findById(commentId);
  if (!comment || comment.deletedAt) throw new AppError(404, 'Comment not found');
  comment.message = message;
  comment.editedAt = new Date();
  await comment.save();
  return comment;
}

export async function deleteComment(commentId: string) {
  const comment = await Comment.findById(commentId);
  if (!comment || comment.deletedAt) throw new AppError(404, 'Comment not found');
  comment.deletedAt = new Date();
  await comment.save();
  return comment;
}
