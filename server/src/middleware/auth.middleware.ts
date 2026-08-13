import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const decoded = AuthService.verifyToken(token);
    // Attach user info to request
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

/**
 * Опціональна авторизація: декодує токен, якщо він є, але НЕ блокує запит 401 якщо токен відсутній.
 */
export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;
    if (token) {
      const decoded = AuthService.verifyToken(token);
      (req as any).user = decoded;
    }
  } catch (error) {
    // Якщо токен невалідний або прострочений, ігноруємо для опціональних ендпоінтів
  }
  next();
};

/**
 * Middleware: дозволяє доступ лише користувачам з роллю 'admin'.
 * Має використовуватись ПІСЛЯ authMiddleware.
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const userRole = (req as any).user?.role;
  if (userRole !== 'admin') {
    res.status(403).json({ error: 'Forbidden: admin access required' });
    return;
  }
  next();
};
