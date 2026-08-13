"use client";

import React, { useState } from 'react';
import { useGetPostsQuery } from '@/lib/redux/services/postsApi';
import PostList from '@/components/PostList/PostList';
import Pagination from '@/components/Pagination/Pagination';
import Preloader from '@/components/Preloader/Preloader'; // Наш оновлений компонент
import styles from './NewsPage.module.scss';
import Sidebar from '@/components/Sidebar/Sidebar';

const NewsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const LIMIT = 20;

  const { data, isLoading, isFetching, error } = useGetPostsQuery({
    page: currentPage,
    limit: LIMIT,
    category: 'news', 
  });

  const posts = data?.data || [];
  const totalPages = data?.numberOfPages || 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) return <div className="container py-10 text-center text-red-500">Помилка.</div>;

  return (
    // ВАЖЛИВО: Передаємо isLoading прямо сюди. 
    // Preloader сам потримає логотип 2 секунди, навіть якщо isLoading стане false раніше.
    <Preloader isLoading={isLoading} type="local">
      
      <div className={`container ${styles.pageContainer}`}>
        <div className={styles.layoutGrid}>
          
          <div className={styles.contentColumn}>
            {/* isFetching тут залишаємо для ефекту прозорості при пагінації */}
            <div style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity 0.2s' }}>
              <PostList posts={posts} />
            </div>

            {posts.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}

            {posts.length === 0 && (
              <p className="text-center py-10">Новин поки немає.</p>
            )}
          </div>

          <aside className={styles.sidebarColumn}>
            <div className={styles.stickyWidget}>
              <Sidebar />
            </div>
          </aside>

        </div>
      </div>

    </Preloader>
  );
};

export default NewsPage;