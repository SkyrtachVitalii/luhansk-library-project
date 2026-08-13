import http from 'http';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import app from './app';
import { initSocket } from './socket';

// Визначаємо середовище: Vercel автоматично встановлює process.env.VERCEL = '1'
const isVercel = !!process.env.VERCEL;

// 1. Завантажуємо правильний файл оточення
if (!isVercel && fs.existsSync('.development.env')) {
  dotenv.config({ path: '.development.env' });
} else {
  dotenv.config(); // На Vercel вантажимо стандартний або беремо змінні з Dashboard
}

// 2. Застосовуємо DNS фікс тільки для локального середовища
if (!isVercel) {
  const dns = require('node:dns');
  dns.setServers(['8.8.8.8', '8.8.4.4']);
}

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }

  if (!MONGO_URI) {
    console.error('❌ MONGO_URI is missing in environment variables!');
    return;
  }

  try {
    console.log('🔄 Підключення до MongoDB (база: luhansk_library)...');
    await mongoose.connect(MONGO_URI, {
      dbName: 'luhansk_library',
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('✅ Успішно підключено до MongoDB (luhansk_library)!');
  } catch (err: any) {
    console.error('❌ Помилка підключення до MongoDB:', err.message);
  }
};

// Vercel Serverless Function entrypoint handler
const handler = async (req: any, res: any) => {
  await connectDB();
  return app(req, res);
};

// Local standalone server initialization
if (!process.env.VERCEL) {
  const httpServer = http.createServer(app);
  initSocket(httpServer);

  connectDB().then(() => {
    httpServer.listen(PORT, () => {
      console.log(`🚀 Сервер запущений на порту ${PORT}`);
    });
  });
}

export default handler;