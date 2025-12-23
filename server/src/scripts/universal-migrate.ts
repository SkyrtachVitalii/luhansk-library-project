import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import Post from '../models/Post';

// --- НАЛАШТУВАННЯ ---
dotenv.config({ path: path.join(__dirname, '../../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MONGO_URI = process.env.MONGO_URI || '';
const CLOUDINARY_ROOT_FOLDER = 'library_archive_main';

// Шляхи
const MIGRATION_DIR = path.join(__dirname, '../../../migration');
const UPLOAD_DIR = path.join(MIGRATION_DIR, 'upload');
const POSTS_JSON_FILE = path.join(MIGRATION_DIR, 'posts.json');
const OUTPUT_MAP_FILE = path.join(MIGRATION_DIR, 'file_map.json');

// Глобальна карта для збереження результатів
const GLOBAL_FILE_MAP: Record<string, string> = {};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- ДОПОМІЖНІ ФУНКЦІЇ ---

// Рекурсивний пошук файлів
const getAllFiles = (dirPath: string, arrayOfFiles: string[] = []) => {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      if (file !== '.DS_Store' && file !== 'Thumbs.db') {
        arrayOfFiles.push(fullPath);
      }
    }
  });
  return arrayOfFiles;
};

// Функція повторної спроби (Retry logic)
const uploadWithRetry = async (filePath: string, options: any, retries = 3): Promise<any> => {
  try {
    if (options.chunk_size) {
        return await cloudinary.uploader.upload_large(filePath, options);
    } else {
        return await cloudinary.uploader.upload(filePath, options);
    }
  } catch (error: any) {
    if (retries > 0) {
      console.log(`   ⚠️ Помилка завантаження. Спроба ${4 - retries}...`);
      await delay(2000);
      return uploadWithRetry(filePath, options, retries - 1);
    }
    throw error;
  }
};

// --- ЕТАП 0: Очищення Cloudinary ---
const cleanCloudinary = async () => {
    console.log('\n🗑️  ЕТАП 0: Повне очищення Cloudinary...');
    try {
        await cloudinary.api.delete_resources_by_prefix(CLOUDINARY_ROOT_FOLDER + '/', { resource_type: 'image' });
        await cloudinary.api.delete_resources_by_prefix(CLOUDINARY_ROOT_FOLDER + '/', { resource_type: 'raw' });
        await cloudinary.api.delete_resources_by_prefix(CLOUDINARY_ROOT_FOLDER + '/', { resource_type: 'video' });
        console.log('   ✅ Файли видалено.');
        
        // Видалення пустих папок (опціонально, Cloudinary робить це сам з часом)
        // await cloudinary.api.delete_folder(CLOUDINARY_ROOT_FOLDER);
    } catch (e) {
        console.warn('   ⚠️ Не вдалося повністю очистити Cloudinary (можливо папка вже пуста).', e);
    }
};

// --- ЕТАП 1: Завантаження файлів ---
const uploadAllFiles = async () => {
  console.log('\n📦 ЕТАП 1: Завантаження файлів (RAW + Images)...');

  if (!fs.existsSync(UPLOAD_DIR)) {
    throw new Error(`❌ Папку не знайдено: ${UPLOAD_DIR}`);
  }

  const allFiles = getAllFiles(UPLOAD_DIR);
  console.log(`🔍 Всього файлів на диску: ${allFiles.length}`);

  for (const [index, filePath] of allFiles.entries()) {
    const relativePath = path.relative(MIGRATION_DIR, filePath).replace(/\\/g, '/');
    const fileDir = path.dirname(relativePath);
    const cloudinaryFolder = path.join(CLOUDINARY_ROOT_FOLDER, fileDir).replace(/\\/g, '/');

    try {
      const stats = fs.statSync(filePath);
      const fileSize = stats.size;
      const extension = path.extname(filePath).toLowerCase();

      // === ГОЛОВНА ЛОГІКА ВИБОРУ ТИПУ ===
      // Примусово ставимо 'raw' для документів, щоб уникнути ліміту 10MB і проблем з відображенням
      const rawExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.zip', '.rar', '.7z', '.txt', '.csv'];
      
      let resourceType: "auto" | "raw" | "image" = "auto";
      
      if (rawExtensions.includes(extension)) {
          resourceType = "raw";
      }

      // Налаштування завантаження
      const uploadOptions: any = {
        folder: cloudinaryFolder,
        use_filename: true,
        unique_filename: false, // Зберігаємо оригінальне ім'я (Cloudinary додасть суфікс якщо треба)
        overwrite: true,        // Перезаписуємо, бо ми робимо повний ресет
        resource_type: resourceType,
        timeout: 120000         // Збільшений таймаут (2 хв)
      };

      // Для великих файлів (> 6MB) використовуємо chunked upload
      if (fileSize > 6000000) {
         uploadOptions.chunk_size = 6000000;
      }

      // Завантаження з повторними спробами
      const result = await uploadWithRetry(filePath, uploadOptions);

      // Зберігаємо в карту
      const key = '/' + relativePath; // /upload/files/name.pdf
      
      if (result && result.secure_url) {
        GLOBAL_FILE_MAP[key] = result.secure_url;
      }

      // Лог
      if ((index + 1) % 50 === 0) console.log(`   📤 [${index + 1}/${allFiles.length}] Оброблено...`);

    } catch (error: any) {
      console.error(`   ❌ ПОМИЛКА: ${relativePath} ->`, error.message);
    }

    // Затримка, щоб не отримати бан по API Rate Limit
    await delay(100); 
  }

  // Зберігаємо карту на диск
  fs.writeFileSync(OUTPUT_MAP_FILE, JSON.stringify(GLOBAL_FILE_MAP, null, 2));
  console.log(`✅ Етап 1 завершено. Карта збережена (${Object.keys(GLOBAL_FILE_MAP).length} файлів).`);
};

// --- ЕТАП 2: Міграція бази даних ---
const migrateDatabase = async () => {
  console.log('\n📝 ЕТАП 2: Міграція бази даних...');

  if (!fs.existsSync(POSTS_JSON_FILE)) throw new Error(`❌ JSON БД не знайдено: ${POSTS_JSON_FILE}`);
  
  const rawData = fs.readFileSync(POSTS_JSON_FILE, 'utf-8');
  const parsedData = JSON.parse(rawData);
  
  let postsArray = [];
  if (Array.isArray(parsedData)) {
      const tableItem = parsedData.find((item: any) => item.type === 'table' && item.data);
      postsArray = tableItem ? tableItem.data : parsedData;
  } else {
      postsArray = parsedData.data || [];
  }

  console.log(`🧹 Очищення MongoDB...`);
  await Post.deleteMany({});
  
  console.log(`🚀 Імпорт ${postsArray.length} постів...`);

  // Функція заміни посилань у тексті
  const replaceLinks = (text: string): string => {
      if (!text) return '';
      // Шукаємо /upload/...
      const regex = /(\/upload\/[a-zA-Z0-9_\-./%]+)/gi;
      
      return text.replace(regex, (match) => {
          // Спробуємо знайти пряме співпадіння
          if (GLOBAL_FILE_MAP[match]) return GLOBAL_FILE_MAP[match];
          
          // Спробуємо декодувати (для кирилиці)
          try {
              const decoded = decodeURIComponent(match);
              if (GLOBAL_FILE_MAP[decoded]) return GLOBAL_FILE_MAP[decoded];
          } catch (e) {}
          
          return match; // Якщо не знайшли - залишаємо як є (хоча це погано)
      });
  };

  for (const [index, item] of postsArray.entries()) {
    let title = item.capt || item.title || 'Без назви';
    let fullContent = item.content || '';
    let shortDesc = item.short || '';
    let menuCategory = item.menu || 'other';
    let oldId = item.id ? Number(item.id) : 0;

    const processedShort = replaceLinks(shortDesc);
    const processedContent = replaceLinks(fullContent);

    // Витягуємо першу картинку для прев'ю
    const extractCloudinaryUrl = (html: string) => {
        const match = html.match(/src=["'](https:\/\/res\.cloudinary\.com[^"']+)["']/);
        return match ? match[1] : '';
    };
    let mainImageUrl = extractCloudinaryUrl(processedShort) || extractCloudinaryUrl(processedContent) || '';

    // Фоллбек для контенту
    let finalContent = processedContent;
    if (!finalContent && processedShort) finalContent = processedShort;
    if (!finalContent) finalContent = '<p>Архівний вміст.</p>';

    const newPost = new Post({
      title,
      shortDescription: processedShort,
      content: finalContent,
      imageUrl: mainImageUrl,
      category: menuCategory,
      viewsCount: item.views ? Number(item.views) : 0,
      createdAt: item.created_at ? new Date(item.created_at) : new Date(),
      updatedAt: new Date(),
      author: 'Archive',
      tags: ['archive', menuCategory],
      oldId,
      originalData: item
    });

    try {
        await newPost.save();
    } catch (e) {
        console.error(`   ❌ DB Error:`, e);
    }

    if ((index + 1) % 100 === 0) process.stdout.write('.');
  }
  console.log('\n✅ Міграція БД завершена.');
};

// --- ГОЛОВНИЙ ЗАПУСК ---
const start = async () => {
    try {
        if (!MONGO_URI) throw new Error('MONGO_URI is missing');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // 1. Очищаємо хмару (Обережно!)
        await cleanCloudinary();

        // 2. Вантажимо файли (RAW для PDF/DOC)
        await uploadAllFiles();

        // 3. Заливаємо пости в базу
        await migrateDatabase();

        console.log('\n🎉🎉🎉 ПОВНА УНІВЕРСАЛЬНА МІГРАЦІЯ ЗАВЕРШЕНА! 🎉🎉🎉');
        console.log('👉 Не забудьте скопіювати migration/file_map.json у client/src/config/file_map.json');
        
        process.exit(0);
    } catch (error) {
        console.error('\n❌ FATAL ERROR:', error);
        process.exit(1);
    }
};

start();