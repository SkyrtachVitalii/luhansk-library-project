"use client";

import React from "react";
import Image from "next/image";
import { useGetPostsQuery } from "@/lib/redux/services/postsApi";
import Preloader from "@/components/Preloader/Preloader";
import styles from "./AboutPage.module.scss";

export default function AboutPage() {
  // Запит: категорія 'about', мова 'uk', ліміт 1 (бо нам потрібен тільки один запис)
  const { data, isLoading, error } = useGetPostsQuery({
    category: "about",
    lang: "uk",
    limit: 1,
  });

  // Беремо перший елемент з масиву
  const post = data?.data?.[0];

  // Якщо сталась помилка
  if (error) {
    return (
      <div className="container py-20 text-center text-red-500">
        Не вдалося завантажити інформацію.
      </div>
    );
  }

  // Обгортаємо все в Preloader
  return (
    <Preloader isLoading={isLoading} type="local">
      <div className={styles.aboutContainer}>
        {post ? (
          <>
            {/* Виводимо HTML контент */}
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </>
        ) : (
          // Якщо завантаження завершилось, але поста немає
          !isLoading && (
            <div className="text-center py-20 text-gray-500">
              <h2 className="text-2xl font-bold mb-2">Інформація відсутня</h2>
              <p>Запис &quot;Про нас&quot; ще не створено або не знайдено.</p>
            </div>
          )
        )}
      </div>
    </Preloader>
  );
}
