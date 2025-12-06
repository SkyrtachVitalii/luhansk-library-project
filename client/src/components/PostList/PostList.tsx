// client/src/components/PostList/PostList.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IPost } from "@/types";
import styles from "./PostList.module.scss";

// 1. Описуємо, що компонент очікує отримати ззовні
interface PostListProps {
  posts: IPost[];
}

// 2. Деструктуризуємо posts з пропсів
export default function PostList({ posts }: PostListProps) {
  
  // Перевірка на пустий масив
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        Список постів порожній.
      </div>
    );
  }

  return (
    <div className={styles.postsContainer}>
      {posts.map((post: IPost) => {
        // Перевіряємо, чи це архівний пост
        const isArchived = post.tags?.includes("archive");

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

            {/* Блок картинки */}
            {post.imageUrl ? (
              <div className={styles.postImageContainer}>
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 800px"
                  // priority можна вираховувати, якщо передавати index, але поки приберемо або залишимо false
                  priority={false} 
                />
              </div>
            ) : (
              <div
                className={`${styles.postImageContainer} flex items-center justify-center text-gray-400 bg-gray-100`}
              >
                Немає зображення
              </div>
            )}

            {/* Контент */}
            {isArchived ? (
              <div
                className={`${styles.postContent} ${styles.archivedContent}`}
                dangerouslySetInnerHTML={{ __html: post.shortDescription }}
              />
            ) : (
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