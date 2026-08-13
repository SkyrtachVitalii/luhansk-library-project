// client/src/app/page.tsx
"use client";
import { useGetPostsQuery } from "@/lib/redux/services/postsApi";
import Preloader from "@/components/Preloader/Preloader"; // <--- Імпортуємо
import PostList from "@/components/PostList/PostList";
import Sidebar from "@/components/Sidebar/Sidebar"; // Переконайтесь, що створили цей компонент
import styles from "./page.module.scss";

export default function Home() {
  const { data, isLoading } = useGetPostsQuery({ page: 1, limit: 7 });
  const posts = data?.data || [];

  return (
    <Preloader isLoading={isLoading} type="local">
      <div className={styles.homeGrid}>
        {/* Ліва частина: Новини */}
        <div className={styles.mainColumn}>
          <PostList posts={posts} />
        </div>

        {/* Права частина: Сайдбар (Віджети) */}
        <aside className={styles.sidebarColumn}>
          <div className={styles.stickySidebar}>
            <Sidebar />
          </div>
        </aside>
      </div>
    </Preloader>
  );
}
