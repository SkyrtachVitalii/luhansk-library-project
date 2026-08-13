import http from 'http';
import dns from 'node:dns';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';
import { initSocket } from './socket';

dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

// 1. Створюємо HTTP сервер на основі Express
const httpServer = http.createServer(app);

// 2. Підключаємо WebSockets до цього сервера
initSocket(httpServer);

// 3. Функція підключення до БД з фолбеком та зрозумілими інструкціями
const startServer = async () => {
  try {
    console.log('🔄 Підключення до MongoDB (база: luhansk_library)...');
    await mongoose.connect(MONGO_URI, {
      dbName: 'luhansk_library',
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Успішно підключено до MongoDB (luhansk_library)!');
  } catch (err: any) {
    console.error('\n❌ Помилка підключення до MongoDB:', err.message);
    console.warn('----------------------------------------------------');
    console.warn('⚠️ Можливі причини помилки (querySrv / ECONNREFUSED / Timeout):');
    console.log(' 1. Кластер MongoDB Atlas заблокований, призупинений (Paused) або видалений.');
    console.log(' 2. Ваша поточна IP-адреса не додана до Network Access (WhiteList) у MongoDB Atlas.');
    console.log(' 3. Мережеве блокування DNS SRV запитів у вашого провайдера або через VPN/файрвол.');
    console.warn('----------------------------------------------------');
    console.warn('💡 РІШЕННЯ:');
    console.log(' а) Увійдіть у MongoDB Atlas і додайте поточну IP-адресу в Network Access (або відкрийте доступ 0.0.0.0/0).');
    console.log(' б) Перевірте статус кластера у MongoDB Atlas (натисніть Resume, якщо кластер призупинено).');
    console.log(' в) Або використовуйте локальну MongoDB, вказавши у файлі server/.env:');
    console.log('    MONGO_URI=mongodb://127.0.0.1:27017/luhansk-library');
    console.warn('----------------------------------------------------\n');
  }

  // Запускаємо сервер, щоб додаток залишався робочим
  httpServer.listen(PORT, () => {
    console.log(`🚀 Сервер запущений на порту ${PORT}`);
  });
};

startServer();