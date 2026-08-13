import { Request, Response } from 'express';
import Post from '../models/Post';

// Створення поста
export const createPost = async (req: Request, res: Response) => {
  try {
    const { title, content, category, author, tags } = req.body;

    const newPost = new Post({
      title,
      content,
      category,
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

// Отримання постів з пагінацією та фільтрацією
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const { page, limit, category, lang } = req.query;

    const currentPage = Number(page) || 1;
    const itemsPerPage = Number(limit) || 7;
    
    const filter: any = {};
    if (category) {
      filter.category = category;
    }

    if (lang) {
      filter['originalData.lang'] = lang;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const total = await Post.countDocuments(filter);

    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .limit(itemsPerPage)
      .skip(startIndex);

    res.json({
      data: posts,
      currentPage: currentPage,
      numberOfPages: Math.ceil(total / itemsPerPage),
      totalPosts: total
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не вдалося отримати пости' });
  }
};

export const getOneOldPost = async (req: Request, res: Response) => {
  try {
    const searchId = Number(req.params.id);
    if (isNaN(searchId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const post = await Post.findOne({ oldId: searchId });

    if (!post) {
      return res.status(404).json({ message: 'Пост не знайдено' });
    }

    res.json(post);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Не вдалося отримати пост' });
  }
};
