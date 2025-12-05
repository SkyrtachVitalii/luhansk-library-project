import mongoose, { Schema } from 'mongoose';
import { IPost } from '../types/post.interface'; // Імпортуємо інтерфейс


// 2. Схема (для MongoDB)
const PostSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    shortDescription: { type: String, default: '' }, // <-- ДОДАЄМО ТУТ
    content: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    category: {
      type: String,
      enum: ['news', 'event', 'announcement', 'recommends'],
      default: 'news',
    },
    viewsCount: { type: Number, default: 0 },
    tags: { type: [String], default: [] },
    author: { type: String, default: 'Admin' },
  },
  {
    timestamps: true, // Це автоматично додасть дату створення
  }
);

export default mongoose.model<IPost>('Post', PostSchema);