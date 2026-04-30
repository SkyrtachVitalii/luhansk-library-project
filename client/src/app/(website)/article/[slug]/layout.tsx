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
  const siteUrl = process.env.PUBLIC_SITE_URL || "http://localhost:3000";
  

  if (!post) {
    return { title: "Новина не знайдена" };
  }

  const cleanDescription = post.content
    ? post.content.replace(/<[^>]*>?/gm, "").slice(0, 150) + "..."
    : "Архівний запис бібліотеки";

    const postImage = post.imageUrl || '/public/logo.png';

  return {
    title: `${post.title} | Архів бібліотеки`,
    description: cleanDescription,
    metadataBase: new URL(siteUrl),
    keywords: ['бібліотека', 'новини', 'архів', ...post.tags || []],
    openGraph: {
      title: post.title,
      description: cleanDescription,
      url: `/article/${slug}`, // Посилання на цю конкретну сторінку
      siteName: 'Моя Бібліотека',
      images: [
        {
          url: postImage, 
          width:200,
          height: 200,
          alt: post.title,
        },
      ],
      locale: 'uk_UA',
      type: 'article', // Тип контенту: стаття
      publishedTime: post.createdAt, // Якщо є дата публікації
    },
    alternates: {
      canonical: `/article/${slug}`,
    },
    robots: {
      index: true, // Дозволити індексувати
      follow: true, // Дозволити переходити по посиланнях
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

// === ОБГОРТКА (LAYOUT) ===
export default function NewsLayout({ children }: Props) {
  // Тут ми просто створюємо контейнер для сторінки
  return <div className="layout-content content-body">{children}</div>;
}
