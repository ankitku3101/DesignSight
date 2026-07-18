import type { Request, Response } from 'express';
import { objectIdSchema } from '../validation/objectId';
import { createCommentSchema, updateCommentSchema } from '../validation/comment.schema';
import * as commentService from '../services/comment.service';

export async function createComment(req: Request, res: Response) {
  const feedbackId = objectIdSchema.parse(req.params.feedbackId);
  const input = createCommentSchema.parse(req.body);
  const comment = await commentService.createComment(feedbackId, input);
  res.status(201).json(comment);
}

export async function listComments(req: Request, res: Response) {
  const feedbackId = objectIdSchema.parse(req.params.feedbackId);
  const tree = await commentService.listCommentTree(feedbackId);
  res.json(tree);
}

export async function updateComment(req: Request, res: Response) {
  const commentId = objectIdSchema.parse(req.params.commentId);
  const { message } = updateCommentSchema.parse(req.body);
  const comment = await commentService.updateComment(commentId, message);
  res.json(comment);
}

export async function deleteComment(req: Request, res: Response) {
  const commentId = objectIdSchema.parse(req.params.commentId);
  const comment = await commentService.deleteComment(commentId);
  res.json(comment);
}
