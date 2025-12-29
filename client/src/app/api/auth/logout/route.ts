// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { deleteSession } from "@/lib/auth"; // Імпортуємо функцію видалення куки

export async function POST() {
  await deleteSession();
  
  // Повертаємо успіх
  return NextResponse.json({ success: true });
}