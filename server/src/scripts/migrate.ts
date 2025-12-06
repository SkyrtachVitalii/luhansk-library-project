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
const JSON_FILE = path.join(MIGRATION_DIR, 'posts.json');  

// Глобальна карта посилань
const GLOBAL_FILE_MAP = new Map<string, string>();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// --- ДОПОМІЖНІ ФУНКЦІЇ ---

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

// --- ЕТАП 1: Завантаження файлів ---
const uploadAllLocalFiles = async () => {
  console.log('\n📦 ЕТАП 1: Завантаження файлів у Cloudinary...');
  
  if (!fs.existsSync(UPLOAD_DIR)) {
    console.error(`❌ Папку не знайдено: ${UPLOAD_DIR}`);
    return;
  }

  const allFiles = getAllFiles(UPLOAD_DIR);
  console.log(`🔍 Всього файлів на диску: ${allFiles.length}`);

  for (const [index, filePath] of allFiles.entries()) {
    const relativePath = path.relative(MIGRATION_DIR, filePath).replace(/\\/g, '/');
    const fileDir = path.dirname(relativePath);
    const cloudinaryFolder = path.join(CLOUDINARY_ROOT_FOLDER, fileDir).replace(/\\/g, '/');

    try {
      const stats = fs.statSync(filePath);
      const fileSizeInBytes = stats.size;
      const fileSizeInMB = fileSizeInBytes / (1024 * 1024);
      
      // --- ВИПРАВЛЕННЯ ТУТ: явно вказуємо any ---
      let result: any; 

      // Якщо файл більший за 9.5 МБ
      if (fileSizeInBytes > 9500000) {
           console.log(`   ⚠️ Великий файл (${fileSizeInMB.toFixed(2)} MB): ${relativePath}. Вантажимо частинами...`);
           
           result = await cloudinary.uploader.upload_large(filePath, {
            folder: cloudinaryFolder,
            use_filename: true,
            unique_filename: false,
            overwrite: false,
            resource_type: "auto",
            chunk_size: 6000000 
          });
      } else {
          // Звичайне завантаження
          result = await cloudinary.uploader.upload(filePath, {
            folder: cloudinaryFolder,
            use_filename: true,
            unique_filename: false,
            overwrite: false, 
            resource_type: "auto"
          });
      }

      // Зберігаємо посилання
      const key = '/' + relativePath; 
      
      // Перевіряємо, чи є secure_url (хоча для any це не обов'язково, але безпечніше)
      if (result && result.secure_url) {
        GLOBAL_FILE_MAP.set(key, result.secure_url);
      }

      if ((index + 1) % 50 === 0) console.log(`   📤 [${index + 1}/${allFiles.length}] Оброблено...`);
      
    } catch (error: any) {
      console.error(`   ❌ Помилка завантаження ${relativePath}:`, error.message);
    }
    
    await delay(50); 
  }
  console.log(`✅ Всі файли оброблено. Карта посилань готова (${GLOBAL_FILE_MAP.size} записів).\n`);
};

// --- ЕТАП 2: Міграція БД ---
const migrateDatabase = async () => {
  console.log('📝 ЕТАП 2: Міграція постів у MongoDB...');

  if (!fs.existsSync(JSON_FILE)) throw new Error(`❌ File not found: ${JSON_FILE}`);
  
  const rawData = fs.readFileSync(JSON_FILE, 'utf-8');
  const parsedData = JSON.parse(rawData);
  
  let postsArray = [];
  if (Array.isArray(parsedData)) {
      const tableItem = parsedData.find((item: any) => item.type === 'table' && item.data);
      postsArray = tableItem ? tableItem.data : parsedData;
  } else {
      postsArray = parsedData.data || [];
  }

  console.log(`🧹 Очищення бази даних...`);
  await Post.deleteMany({}); 
  console.log(`✅ Колекцію очищено.`);
  
  console.log(`🚀 Починаємо імпорт ${postsArray.length} постів...`);

  for (const [index, item] of postsArray.entries()) {
    
    let title = item.capt || item.title || 'Без назви';
    let fullContent = item.content || '';
    let shortDesc = item.short || '';
    let menuCategory = item.menu || 'other';
    let oldId = item.id ? Number(item.id) : 0;
    
    const replaceLinks = (text: string): string => {
        if (!text) return '';
        const regex = /(\/upload\/[a-zA-Z0-9_\-./]+)/gi;
        return text.replace(regex, (match) => {
            if (GLOBAL_FILE_MAP.has(match)) {
                return GLOBAL_FILE_MAP.get(match)!;
            }
            return match; 
        });
    };

    const processedShort = replaceLinks(shortDesc);
    const processedContent = replaceLinks(fullContent);

    const extractCloudinaryUrl = (html: string) => {
        const match = html.match(/src=["'](https:\/\/res\.cloudinary\.com[^"']+)["']/);
        return match ? match[1] : '';
    };
    let mainImageUrl = extractCloudinaryUrl(processedShort) || extractCloudinaryUrl(processedContent) || '';

    let finalContent = processedContent;
    if (!finalContent && processedShort) finalContent = processedShort;
    if (!finalContent) finalContent = '<p>Архівний вміст.</p>';

    const newPost = new Post({
      title: title,
      shortDescription: processedShort,
      content: finalContent,
      imageUrl: mainImageUrl,
      category: menuCategory,
      viewsCount: item.views ? Number(item.views) : 0,
      createdAt: item.created_at ? new Date(item.created_at) : new Date(),
      updatedAt: new Date(),
      author: 'Archive',
      tags: ['archive', menuCategory],
      oldId: oldId,
      originalData: item          
    });

    try {
        await newPost.save();
    } catch (e) {
        console.error(`   ❌ DB Error (${title}):`, e);
    }

    if ((index + 1) % 50 === 0) console.log(`   ⏳ Оброблено: ${index + 1}`);
  }
};

// --- ЗАПУСК ---
const start = async () => {
    try {
        if (!MONGO_URI) throw new Error('MONGO_URI is missing');
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        await uploadAllLocalFiles();
        await migrateDatabase();

        console.log('🎉 МІГРАЦІЯ ЗАВЕРШЕНА УСПІШНО!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Fatal Error:', error);
        process.exit(1);
    }
};

start();