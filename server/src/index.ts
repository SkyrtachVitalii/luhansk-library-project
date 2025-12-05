import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';
import { initSocket } from './socket';

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

// 1. Створюємо HTTP сервер на основі Express
const httpServer = http.createServer(app);

// 2. Підключаємо WebSockets до цього сервера
initSocket(httpServer);

// 3. Підключаємо БД і запускаємо сервер
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error(err));