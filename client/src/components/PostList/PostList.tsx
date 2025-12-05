// client/src/components/PostList/PostList.tsx
'use client';

import React from 'react';
import Link from 'next/link'; // Для заголовків-посилань
import Image from 'next/image'; // Для оптимізованих зображень
import { useGetPostsQuery } from '@/lib/redux/services/postsApi';
import { IPost } from '@/types';
import styles from './PostList.module.scss'; // Імпортуємо нові стилі

export default function PostList() {
  const { data: posts, error, isLoading } = useGetPostsQuery();

  if (isLoading) return <div className="text-center p-8 text-gray-500">Завантаження новин...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Помилка завантаження даних.</div>;

  if (!posts || posts.length === 0) {
    return <div className="text-center p-8 text-gray-500">Новин поки немає.</div>;
  }

  return (
    <div className={styles.postsContainer}>
      {posts.map((post: IPost) => (
        <article key={post._id} className={styles.postItem}>
          {/* 1. Заголовок і Дата */}
          <header className={styles.postHeader}>
             {/* Заголовок зробимо посиланням на сторінку поста (реалізуємо пізніше) */}
            <Link href={`/posts/${post._id}`} className={styles.postTitle}>
              {post.title}
            </Link>
            <span className={styles.postDate}>
              {new Date(post.createdAt).toLocaleDateString('uk-UA')}
            </span>
          </header>

          {/* 2. Зображення (якщо воно є) */}
          {post.imageUrl ? (
            <div className={styles.postImageContainer}>
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill // Заповнює батьківський контейнер
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 800px" // Підказка для браузера, якого розміру качати картинку
                priority={posts.indexOf(post) === 0} // Пріоритет завантаження для першого поста
              />
            </div>
          ) : (
             // Можна додати заглушку, якщо картинки немає
             <div className={`${styles.postImageContainer} flex items-center justify-center text-gray-400`}>
                Немає зображення
             </div>
          )}

          {/* 3. Контент */}
          {/* Поки виводимо повний текст, як на першому пості скриншоту */}
          <div className={styles.postContent}>
            {post.content}
          </div>
        </article>
      ))}
    </div>
  );
}