"use client";

import { useState } from "react";
import Preloader from "@/components/Preloader/Preloader"; // <--- Імпортуємо
import { useGetPostsQuery } from "@/lib/redux/services/postsApi";
import PostList from "@/components/PostList/PostList";
import Pagination from "@/components/Pagination/Pagination";
import styles from "./RecommendsPage.module.scss"; // Імпортуємо стилі
import Sidebar from "@/components/Sidebar/Sidebar";

export default function RecommendsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const LIMIT = 20;

  // --- ГОЛОВНА ЗМІНА ТУТ ---
  // Запитуємо пости саме категорії 'recommends'
  const { data, isLoading, isFetching, error } = useGetPostsQuery({
    page: currentPage,
    limit: LIMIT,
    category: "recommends",
  });

  const posts = data?.data || [];
  const totalPages = data?.numberOfPages || 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error)
    return (
      <div className="container py-10 text-center text-red-500">
        Помилка завантаження.
      </div>
    );

  return (
    <Preloader isLoading={isLoading} type="local">
      <div className={`container ${styles.pageContainer}`}>
        <div className={styles.layoutGrid}>
          {/* Ліва частина: Контент */}
          <main className={styles.contentColumn}>
            <div
              style={{
                opacity: isFetching ? 0.6 : 1,
                transition: "opacity 0.2s",
              }}
            >
              {/* Передаємо отримані пости в наш універсальний компонент */}
              <PostList posts={posts} />
            </div>

            {posts.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}

            {posts.length === 0 && !isLoading && (
              <p className="text-center py-10">
                У розділі &quot;Пропонуємо&quot; поки немає дописів.
              </p>
            )}
          </main>

          {/* Права частина: Сайдбар */}
          <aside className={styles.sidebarColumn}>
            <div className={styles.stickyWidget}>
              <Sidebar />
            </div>
          </aside>
        </div>
      </div>
    </Preloader>
  );
}
