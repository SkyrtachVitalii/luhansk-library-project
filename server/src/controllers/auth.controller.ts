import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { User } from '../models/User';

export const register = async (req: Request, res: Response) => {
  try {
    const user = await AuthService.register(req.body);
    const userObj = user.toObject();
    delete (userObj as any).passwordHash;
    res.status(201).json({ message: 'User registered successfully', user: userObj });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await AuthService.login(email, password);

    const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;

    res.cookie('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    const userObj = user.toObject();
    delete (userObj as any).passwordHash;

    res.json({ message: 'Logged in successfully', user: userObj });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};

export const logout = (req: Request, res: Response) => {
  const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
  res.clearCookie('token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  });
  res.json({ message: 'Logged out successfully' });
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.json({ user: null, isAuthenticated: false });
      return;
    }

    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      res.json({ user: null, isAuthenticated: false });
      return;
    }

    res.json({ user, isAuthenticated: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
