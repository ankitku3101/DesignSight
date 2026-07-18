import { Router } from 'express';
import * as commentController from '../controllers/comment.controller';

const router = Router();

router.post('/feedback/:feedbackId/comments', commentController.createComment);
router.get('/feedback/:feedbackId/comments', commentController.listComments);
router.patch('/comments/:commentId', commentController.updateComment);
router.delete('/comments/:commentId', commentController.deleteComment);

export default router;
