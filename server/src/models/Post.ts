import mongoose, { Schema } from 'mongoose';
import { IPost } from '../types/post.interface'; // Імпортуємо інтерфейс


// 2. Схема (для MongoDB)
const PostSchema: Schema = new Schema({
  title: { type: String, required: true },
  shortDescription: { type: String },
  content: { type: String, required: true },
  imageUrl: { type: String },
  category: { type: String, default: 'news' },
  viewsCount: { type: Number, default: 0 },
  tags: { type: [String] },
  author: { type: String, default: 'Admin' },
  
  // Додаємо нові поля
  oldId: { type: Number, index: true }, // Індекс, щоб швидко шукати по старому ID
  seoKeywords: { type: String },
  seoDescription: { type: String },
  originalData: { type: Schema.Types.Mixed }, // Mixed дозволяє зберігати будь-який JSON об'єкт

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPost>('Post', PostSchema);