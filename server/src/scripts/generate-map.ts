// server/src/scripts/generate-map.ts
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

// --- НАЛАШТУВАННЯ ---
dotenv.config({ path: path.join(__dirname, '../../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const CLOUDINARY_ROOT_FOLDER = 'library_archive_main'; 

// Шляхи (ідентичні до migrate.ts)
const MIGRATION_DIR = path.join(__dirname, '../../../migration');
const UPLOAD_DIR = path.join(MIGRATION_DIR, 'upload');     
// Файл, куди ми запишемо результат
const OUTPUT_MAP_FILE = path.join(MIGRATION_DIR, 'file_map.json');

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

// --- ОСНОВНА ЛОГІКА ---
const generateMap = async () => {
  console.log('\n🗺️  Генерація карти посилань Cloudinary...');
  
  if (!fs.existsSync(UPLOAD_DIR)) {
    console.error(`❌ Папку не знайдено: ${UPLOAD_DIR}`);
    return;
  }

  const allFiles = getAllFiles(UPLOAD_DIR);
  console.log(`🔍 Всього файлів на диску: ${allFiles.length}`);

  // Об'єкт для запису результатів: { "/upload/file.jpg": "https://..." }
  const fileMap: Record<string, string> = {};

  for (const [index, filePath] of allFiles.entries()) {
    // Формуємо відносний шлях, наприклад: upload/files/image.jpg
    const relativePath = path.relative(MIGRATION_DIR, filePath).replace(/\\/g, '/');
    
    // Cloudinary папка
    const fileDir = path.dirname(relativePath);
    const cloudinaryFolder = path.join(CLOUDINARY_ROOT_FOLDER, fileDir).replace(/\\/g, '/');

    try {
      const stats = fs.statSync(filePath);
      const fileSizeInBytes = stats.size;
      
      let result: any; 

      // Логіка для великих файлів (ідентична до migrate.ts)
      if (fileSizeInBytes > 9500000) {
           result = await cloudinary.uploader.upload_large(filePath, {
            folder: cloudinaryFolder,
            use_filename: true,
            unique_filename: false,
            overwrite: false, // НЕ ПЕРЕЗАПИСУВАТИ (економить час)
            resource_type: "auto",
            chunk_size: 6000000 
          });
      } else {
          result = await cloudinary.uploader.upload(filePath, {
            folder: cloudinaryFolder,
            use_filename: true,
            unique_filename: false,
            overwrite: false, // НЕ ПЕРЕЗАПИСУВАТИ
            resource_type: "auto"
          });
      }

      // Ключ карти повинен починатися зі слеша: /upload/...
      const key = '/' + relativePath; 
      
      if (result && result.secure_url) {
        fileMap[key] = result.secure_url;
      }

      // Логування прогресу
      if ((index + 1) % 50 === 0) {
        console.log(`   Processed [${index + 1}/${allFiles.length}] -> ${key}`);
      }
      
    } catch (error: any) {
      console.error(`   ❌ Помилка обробки ${relativePath}:`, error.message);
    }
    
    // Невелика затримка, щоб не перевантажити API
    await delay(30); 
  }

  // --- ЗАПИС У ФАЙЛ ---
  console.log(`\n💾 Запис результатів у файл: ${OUTPUT_MAP_FILE}`);
  try {
      fs.writeFileSync(OUTPUT_MAP_FILE, JSON.stringify(fileMap, null, 2));
      console.log(`✅ Успішно! Збережено посилань: ${Object.keys(fileMap).length}`);
      console.log(`👉 Тепер перенесіть цей файл у client/src/config/file_map.json`);
  } catch (e) {
      console.error('❌ Помилка запису файлу:', e);
  }
};

generateMap();