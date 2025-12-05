import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
// Переконайтесь, що шлях до моделі правильний
import Post from "../models/Post";

// Підключаємо змінні оточення (.env)
dotenv.config({ path: path.join(__dirname, "../../.env") });

// Налаштування хмари
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const MONGO_URI = process.env.MONGO_URI || "";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Функція "витягування" першої картинки з HTML тексту
const extractImageSrc = (htmlString: string): string | null => {
  if (!htmlString) return null;
  // Шукаємо src="..." або src='...'
  const match = htmlString.match(/src=["']([^"']+)["']/);
  return match ? match[1] : null;
};

const migrateData = async () => {
  try {
    // 1. Підключення до БД
    if (!MONGO_URI) throw new Error("MONGO_URI is missing");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // 2. Визначаємо шляхи
    // Папка migration (корінь для файлів)
    const migrationRoot = path.join(__dirname, "../../../migration");
    const jsonPath = path.join(migrationRoot, "posts.json");

    if (!fs.existsSync(jsonPath)) {
      throw new Error(`❌ File not found: ${jsonPath}`);
    }

    // 3. Читаємо дані
    const rawData = fs.readFileSync(jsonPath, "utf-8");
    const parsedData = JSON.parse(rawData);

    // --- ВИПРАВЛЕНА ЛОГІКА ---
    let postsArray = [];

    if (Array.isArray(parsedData)) {
      // Шукаємо елемент, який містить реальні дані (type: 'table')
      const tableItem = parsedData.find(
        (item: any) => item.type === "table" && item.data
      );

      if (tableItem) {
        console.log(
          "📦 Знайдено структуру phpMyAdmin. Витягуємо дані з таблиці..."
        );
        postsArray = tableItem.data;
      } else {
        // Якщо це не phpMyAdmin формат, а просто список новин
        postsArray = parsedData;
      }
    } else {
      // Якщо це об'єкт { data: [...] }
      postsArray = parsedData.data || parsedData.posts || [];
    }
    // -------------------------

    console.log(
      `🚀 Знайдено ${postsArray.length} записів. Починаємо міграцію...`
    );

    // 4. Запускаємо цикл
    for (const [index, item] of postsArray.entries()) {
      let cloudImageUrl = "";

      // Логіка пошуку картинки:
      // Спочатку шукаємо в "short" (короткий опис), якщо ні - в "full_text" (розкодований BLOB)
      let relativePath =
        extractImageSrc(item.short) || extractImageSrc(item.full_text);

      if (relativePath) {
        // У базі шлях виглядає як "/upload/images/..."
        // Нам треба прибрати перший слеш, щоб шлях став "upload/images/..."
        if (relativePath.startsWith("/")) {
          relativePath = relativePath.slice(1);
        }

        // Повний шлях на вашому ПК: migration/upload/images/...
        const localFilePath = path.join(migrationRoot, relativePath);

        // Перевіряємо, чи файл існує на диску
        if (fs.existsSync(localFilePath)) {
          try {
            // Завантажуємо в Cloudinary
            const uploadRes = await cloudinary.uploader.upload(localFilePath, {
              folder: "library_archive",
              use_filename: true,
              unique_filename: false,
              overwrite: false,
              transformation: [
                { width: 1000, crop: "limit" }, // Оптимізація розміру
                { quality: "auto" }, // Оптимізація якості
                { fetch_format: "auto" }, // Оптимізація формату (webp)
              ],
            });
            cloudImageUrl = uploadRes.secure_url;
            console.log(
              `   📸 [${index + 1}] Image uploaded: ${cloudImageUrl}`
            );
          } catch (err) {
            console.error(`   ⚠️ Cloudinary upload failed: ${relativePath}`);
          }
        } else {
          // Часто буває, що в базі посилання є, а файлу вже давно немає - це ок
          // console.warn(`   ⚠️ Local file missing: ${relativePath}`);
        }
      }

      // Створення поста в MongoDB
      // Використовуємо поля з вашого SQL запиту: item.title, item.full_text
      // 1. Формуємо контент.
      // Пробуємо всі можливі варіанти полів зі старої бази.
      let contentData =
        item.full_text || item.short || item.body || item.content || "";

      // 2. Очищаємо контент від зайвих пробілів
      if (typeof contentData === "string") {
        contentData = contentData.trim();
      }

      // 3. Якщо контенту все одно немає — ставимо заглушку, щоб база не лаялась
      if (!contentData || contentData === "") {
        console.warn(
          `   ⚠️ Увага: У поста "${item.title}" немає тексту. Додаю заглушку.`
        );
        contentData = "<p>Деталі новини відсутні або знаходяться в архіві.</p>";
      }

      // 1. Короткий опис беремо з item.short
      let shortDesc = item.short || '';
      
      // 2. Повний текст беремо з item.full_text (або item.body)
      let fullContent = item.full_text || item.body || item.content || '';

      // Якщо повного тексту немає, а є тільки короткий - дублюємо короткий в повний
      if (!fullContent && shortDesc) {
          fullContent = shortDesc;
      }
      
      // Заглушка, якщо зовсім пусто
      if (!fullContent) fullContent = '<p>Деталі в архіві.</p>';

      let postCategory = 'news';
      if (item.menu === 'recommends') {
          postCategory = 'recommends';
      }

      const newPost = new Post({
        title: item.title || 'Новина без назви',
        shortDescription: shortDesc,
        content: fullContent,
        imageUrl: cloudImageUrl,
        
        category: postCategory, // <-- ТУТ ТЕПЕР ДИНАМІЧНА КАТЕГОРІЯ
        
        viewsCount: 0,
        createdAt: item.created_at ? new Date(item.created_at) : new Date(),
        updatedAt: new Date(),
        author: 'Archive',
        tags: ['архів']
      });

      // Додаємо try/catch безпосередньо для збереження, щоб один поганий пост не зупиняв весь процес
      try {
        await newPost.save();
      } catch (saveError) {
        console.error(
          `   ❌ Не вдалося зберегти пост "${item.title}":`,
          saveError
        );
        // continue дозволяє циклу йти далі до наступного поста
        continue;
      }

      // Виводимо прогрес кожні 10 постів, щоб не спамити
      if ((index + 1) % 10 === 0) {
        console.log(
          `   Processed ${index + 1} / ${postsArray.length} posts...`
        );
      }

      // Маленька пауза, щоб не перевантажити мережу
      await delay(200);
    }

    console.log("🎉 Migration Completed Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration Failed:", error);
    process.exit(1);
  }
};

migrateData();
