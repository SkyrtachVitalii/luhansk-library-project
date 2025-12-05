// client/src/components/PostList/PostList.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useGetPostsQuery } from "@/lib/redux/services/postsApi";
import { IPost } from "@/types";
import styles from "./PostList.module.scss";

export default function PostList() {
  const { data: posts, error, isLoading } = useGetPostsQuery();

  if (isLoading)
    return (
      <div className="text-center p-8 text-gray-500">Завантаження новин...</div>
    );
  if (error)
    return (
      <div className="text-center p-8 text-red-500">
        Помилка завантаження даних.
      </div>
    );

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">Новин поки немає.</div>
    );
  }

  return (
    <div className={styles.postsContainer}>
      {posts.map((post: IPost) => {
        // Перевіряємо, чи це архівний пост (по тегу, який ми додали при міграції)
        const isArchived = post.tags?.includes("архів");

        return (
          <article key={post._id} className={styles.postItem}>
            <header className={styles.postHeader}>
              <Link href={`/posts/${post._id}`} className={styles.postTitle}>
                {post.title}
              </Link>
              <span className={styles.postDate}>
                {new Date(post.createdAt).toLocaleDateString("uk-UA")}
              </span>
            </header>

            {/* Блок картинки (однаковий для всіх) */}
            {post.imageUrl ? (
              <div className={styles.postImageContainer}>
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 800px"
                  priority={posts.indexOf(post) === 0}
                />
              </div>
            ) : (
              // Якщо хочете, можна прибрати блок else, щоб не показувати сірий квадрат
              <div
                className={`${styles.postImageContainer} flex items-center justify-center text-gray-400 bg-gray-100`}
              >
                Немає зображення
              </div>
            )}

            {/* --- ЛОГІКА РЕНДЕРИНГУ КОНТЕНТУ --- */}
            {isArchived ? (
              // Для архівних: рендеримо HTML з shortDescription
              <div
                className={`${styles.postContent} ${styles.archivedContent}`}
                dangerouslySetInnerHTML={{ __html: post.shortDescription }}
              />
            ) : (
              // Для нових: рендеримо shortDescription як текст (або content, якщо short немає)
              <div className={styles.postContent}>
                {post.shortDescription || post.content}
              </div>
            )}

            {/* Кнопка читати далі */}
            <div className={styles.readMoreContainer}>
              <Link
                href={`/posts/${post._id}`}
                className={styles.readMoreContainer__link}
              >
                Читати далі →
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
