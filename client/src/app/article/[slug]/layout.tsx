// src/app/news/[slug]/layout.tsx

import { Metadata } from "next";
import { getPost } from "@/lib/api"; // Імпортуємо фетчер з api.ts

type Props = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

// === ГЕНЕРАЦІЯ SEO ===
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "Новина не знайдена" };
  }

  const cleanDescription = post.content
    ? post.content.replace(/<[^>]*>?/gm, "").slice(0, 150) + "..."
    : "Архівний запис бібліотеки";

  return {
    title: `${post.title} | Архів бібліотеки`,
    description: cleanDescription,
    openGraph: {
      title: post.title,
      description: cleanDescription,
      images: post.imageUrl ? [post.imageUrl] : [],
    },
  };
}

// === ОБГОРТКА (LAYOUT) ===
export default function NewsLayout({ children }: Props) {
  // Тут ми просто створюємо контейнер для сторінки
  return (
    <div className="layout-content content-body">
      {children}
    </div>
  );
}