import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/auth.controller';
import { optionalAuthMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', optionalAuthMiddleware, getMe);

export default router;
