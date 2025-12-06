export interface IPost {
  _id: string;
  title: string;
  shortDescription: string; // <-- Додали
  content: string;
  imageUrl?: string;
  category?: 'news' | 'event' | 'announcement' | 'recommends';
  viewsCount: number;
  tags?: string[];
  author: string;
  createdAt: string; // JSON повертає дату як рядок
  updatedAt: string;
}