import { Document } from 'mongoose';

// 1. Інтерфейс (для TypeScript)
export interface IPost extends Document {
  title: string;
  content: string;
  imageUrl?: string;
  category: 'news' | 'event' | 'announcement';
  viewsCount: number;
  tags?: string[];
  author?: string;
  createdAt: Date;
  updatedAt: Date;
}