import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).lean();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, role, phone, gender } = req.body;

    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({ message: "Обов'язкові поля: email, password, firstName, lastName" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Користувач із таким email вже існує' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      gender: gender || 'Male',
      role: role || 'user',
      passwordHash,
    });

    await user.save();

    const userObj = user.toObject();
    delete (userObj as Record<string, unknown>).passwordHash;

    res.status(201).json({ message: 'Користувача успішно створено', user: userObj });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Не вдалося створити користувача';
    res.status(500).json({ message: errorMessage });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

