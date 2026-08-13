import { Router } from 'express';
import { getAllUsers, deleteUser } from '../controllers/user.controller';
import { authMiddleware, requireAdmin } from '../middleware/auth.middleware';

const router = Router();

// GET: список юзерів — тільки автентифіковані (admin + manager бачать у layout)
router.get('/', authMiddleware, getAllUsers);
// DELETE: видалення юзера — тільки адмін (захист на рівні сервера)
router.delete('/:id', authMiddleware, requireAdmin, deleteUser);

export default router;
