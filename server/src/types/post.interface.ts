import { Document } from 'mongoose';

// 1. Інтерфейс (для TypeScript)
export interface IPost extends Document {
  title: string;
  shortDescription: string;
  content: string;
  imageUrl: string;
  category: string;
  viewsCount: number;
  tags: string[];
  author: string;
  
  // Нові поля для збереження історії
  oldId: number;           // Старий ID з MySQL (важливо!)
  seoKeywords: string;     // Якщо було поле keywords
  seoDescription: string;  // Якщо було поле description
  originalData: any;       // Тут буде лежати весь старий об'єкт JSON "про всяк випадок"
  
  createdAt: Date;
  updatedAt: Date;
}