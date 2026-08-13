import { Router } from 'express';
import { createPost, getAllPosts, getOneOldPost } from '../controllers/post.controller';

const router = Router();

// GET /api/posts - отримати всі
router.get('/', getAllPosts);

// GET /api/posts/old/:id - отримати за старим архівним ID
router.get('/old/:id', getOneOldPost);

// POST /api/posts - створити новий
router.post('/', createPost);

export default router;
