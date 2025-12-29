// src/app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

export async function GET() {
  const session = await verifySession();

  // Якщо сесії немає (session === null)
  if (!session) {
    return NextResponse.json({ isAuth: false });
  }

  // Якщо сесія є
  return NextResponse.json({ 
    isAuth: true, 
    user: session // Тут буде { userId, role, name }
  });
}