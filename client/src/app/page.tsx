import PostList from "@/components/PostList/PostList";
import Sidebar from "@/components/Sidebar/Sidebar"; // Переконайтесь, що створили цей компонент
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.homeGrid}>
      
      {/* Ліва частина: Новини */}
      <div className={styles.mainColumn}>
        <PostList />
      </div>

      {/* Права частина: Сайдбар (Віджети) */}
      <aside className={styles.sidebarColumn}>
        <div className={styles.stickySidebar}>
           <Sidebar />
        </div>
      </aside>

    </div>
  );
}