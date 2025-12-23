// src/lib/api.ts
import { IPost } from "@/types";

export async function getPost(oldId: string): Promise<IPost | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  
  try {
    const res = await fetch(`${apiUrl}/api/posts/old/${oldId}`, {
      // revalidate: 60 — це означає, що Next.js кешуватиме запит на 60 сек.
      // Оскільки ми викликаємо цю функцію двічі (в SEO і в Page),
      // Next.js розумний і зробить лише ОДИН реальний запит на сервер.
      next: { revalidate: 60 } 
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}