// src/lib/auth.ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "change-me-to-super-secret-key");

// 👇 ПРИБРАЛИ рядок з any. Тепер тут тільки конкретні поля.
interface SessionPayload {
  userId: string;
  role: string;
  name?: string; 
}

export async function createSession(payload: SessionPayload) {
  const token = await new SignJWT({ ...payload }) // Розгортаємо об'єкт, щоб TS був задоволений
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1d")
    .sign(SECRET_KEY);

  const cookieStore = await cookies();
  
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function verifySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session_token");
}