// src/lib/auth.ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { SessionPayload } from "@/types/user.types";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || "change-me-to-super-secret-key");

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

export async function verifySession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token")?.value;

  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as SessionPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session_token");
}