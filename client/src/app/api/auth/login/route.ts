// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// 👇 ПЕРЕВІР ЦІ ШЛЯХИ У СЕБЕ В ПРОЄКТІ:
import { connectToDB } from "@/lib/db";      // Де лежить твій файл db.ts? (може @/utils/db ?)
import { User } from "@/lib/models/User";     // Де лежить модель User? (може @/lib/models/User ?)
import { createSession } from "@/lib/auth";  // Цей файл ми щойно зробили, має бути тут

export async function POST(req: Request) {
  try {
    // 1. Читаємо дані, які прийшли з фронтенду
    const body = await req.json();
    const { email, password } = body; 
    // identifier - це логін (email)
    // password - це пароль

    // 2. Підключаємось до бази
    await connectToDB();

    // 3. Шукаємо юзера
    // У твоїй схемі поле називається "email", а з фронта приходить "identifier"
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Користувача не знайдено" },
        { status: 401 }
      );
    }

    // 4. Перевіряємо пароль
    // У схемі поле називається "passwordHash"
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Невірний пароль" },
        { status: 401 }
      );
    }

    // 5. Все ок — створюємо сесію
    await createSession({
      userId: user._id.toString(),
      role: user.role,
      name: user.firstName
    });

    return NextResponse.json({
      success: true,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Помилка сервера" },
      { status: 500 }
    );
  }
}