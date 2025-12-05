import { Document } from 'mongoose';

// 1. Інтерфейс (для TypeScript)
export interface IPost extends Document {
  title: string;
  shortDescription: string; // <-- НОВЕ ПОЛЕ
  content: string;
  imageUrl?: string;
  category: 'news' | 'event' | 'announcement' | 'recommends';
  viewsCount: number;
  tags?: string[];
  author?: string;
  createdAt: Date;
  updatedAt: Date;
}