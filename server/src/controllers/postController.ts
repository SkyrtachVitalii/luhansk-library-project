import { Request, Response } from 'express';
import Post from '../models/Post';

// Створення поста (Залишаємо без змін)
export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, category, author, tags } = req.body;

    const newPost = new Post({
      title,
      content,
      category, // переконайтеся, що це поле є у вашій схемі Mongoose
      author,
      tags,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не вдалося створити пост' });
  }
};

// Отримання постів (Оновлена версія з пагінацією та фільтрацією)
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    // 1. Отримуємо параметри з URL (наприклад: /posts?page=2&limit=20&category=news)
    const { page, limit, category, lang } = req.query;

    // Налаштування значень за замовчуванням, якщо фронтенд нічого не передав
    const currentPage = Number(page) || 1;
    const itemsPerPage = Number(limit) || 7;
    
    // 2. Формуємо об'єкт фільтрації
    // Якщо категорія є — шукаємо по ній. Якщо ні — шукаємо все (порожній об'єкт).
    const filter: any = {};
    if (category) {
        filter.category = category;
    }

    if (lang) {
        filter['originalData.lang'] = lang;
    }

    // 3. Рахуємо, скільки постів треба пропустити (skip)
    // Наприклад: сторінка 1 -> пропустити 0. Сторінка 2 (по 20 шт) -> пропустити 20.
    const startIndex = (currentPage - 1) * itemsPerPage;

    // 4. Отримуємо загальну кількість постів за цим фільтром (потрібно для кнопок пагінації)
    const total = await Post.countDocuments(filter);

    // 5. Отримуємо самі пости
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 }) // Спочатку найновіші
      .limit(itemsPerPage)     // Беремо тільки потрібну кількість
      .skip(startIndex);       // Пропускаємо попередні сторінки

    // 6. Відправляємо розширену відповідь
    res.json({
      data: posts,                    // Масив самих постів
      currentPage: currentPage,       // Яка зараз сторінка
      numberOfPages: Math.ceil(total / itemsPerPage), // Скільки всього сторінок (округлюємо вгору)
      totalPosts: total               // Скільки всього записів
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не вдалося отримати пости' });
  }
};