// create-admin.js
import { Schema, models, model, connect, disconnect } from 'mongoose';
import { genSalt, hash } from 'bcryptjs';
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config(); // Читаємо .env файл

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGODB_URI не знайдено в .env файлі");
  process.exit(1);
}

// 1. Описуємо твою схему ТОЧНО як у тебе (щоб знати куди писати)
const UserSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    patronymic: { type: String },
    email: { type: String, required: true, unique: true }, // Це буде логін
    phone: { type: String, required: true },
    passwordHash: { type: String, required: true }, // Твоя назва поля для пароля
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ["Чоловіча", "Жіноча"], required: true },
    address: { type: String, required: true },
    education: { type: String },
    activitiField: { type: String },
    workplace: { type: String },
    addictionalInfo: { type: String },
    gdprConsent: { type: Boolean, required: true },
    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user"
    },
  },
  { timestamps: true, collection: "luhansk_library_accounts" } // Твоя колекція
);

const User = models.User || model("User", UserSchema);

async function createSuperAdmin() {
  try {
    // 2. Підключення
    await connect(MONGO_URI, { dbName: "luhansk_library" });
    console.log("✅ Підключено до DB");

    // 3. Дані адміна
    const adminPassword = "37ghhjgiq6he6";
    // Хешуємо пароль
    const salt = await genSalt(10);
    const hashedPassword = await hash(adminPassword, salt);

    // 4. Формуємо об'єкт (заповнюємо всі required поля!)
    const adminData = {
      firstName: "Super",
      lastName: "Admin",
      email: "superAdmin", // Використовуємо це як логін
      phone: "+380997515765", // Заглушка
      passwordHash: hashedPassword, // Записуємо хеш
      dateOfBirth: new Date("2000-01-01"),
      gender: "Чоловіча", // Має співпадати з enum
      address: "Library Server",
      gdprConsent: true,
      role: "admin"
    };

    // 5. Оновлюємо, якщо є, або створюємо нового
    const user = await User.findOneAndUpdate(
      { email: "superAdmin" }, // Шукаємо за email
      adminData,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log("🎉 SuperAdmin успішно створений у колекції luhansk_library_accounts!");
    console.log("Login (email):", user.email);
    console.log("Role:", user.role);

  } catch (error) {
    console.error("❌ Помилка створення:", error);
  } finally {
    await disconnect();
  }
}

createSuperAdmin();