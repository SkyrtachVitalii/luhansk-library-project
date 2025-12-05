import { Request, Response } from 'express';
import Post from '../models/Post';

// Створення поста
export const createPost = async (req: Request, res: Response) => {
  try {
    // Отримуємо дані від клієнта (фронтенду)
    const { title, content, category, author, tags } = req.body;

    // Створюємо новий об'єкт поста
    const newPost = new Post({
      title,
      content,
      category,
      author,
      tags,
      // imageUrl додамо пізніше
    });

    // Зберігаємо в базу даних
    const savedPost = await newPost.save();

    // Відповідаємо клієнту, що все добре
    res.status(201).json(savedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не вдалося створити пост' });
  }
};

// Отримання всіх постів
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    // Було:
    // const posts = await Post.find().sort({ createdAt: -1 });
    
    // Стало (додали .limit(20)):
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // Спочатку нові
      .limit(20);              // Взяти тільки перші 20 штук
      
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не вдалося отримати пости' });
  }
};