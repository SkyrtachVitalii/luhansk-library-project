import { Router } from 'express';
import { createPost, getAllPosts } from '../controllers/postController';

const router = Router();

// GET /api/posts - отримати всі
router.get('/', getAllPosts);

// POST /api/posts - створити новий
router.post('/', createPost);

export default router;