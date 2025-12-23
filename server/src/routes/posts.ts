import { Router } from 'express';
import { createPost, getAllPosts, getOneOldPost } from '../controllers/postController';

const router = Router();

// GET /api/posts - отримати всі
router.get('/', getAllPosts);

router.get('/old/:id', getOneOldPost)

// POST /api/posts - створити новий
router.post('/', createPost);

export default router;