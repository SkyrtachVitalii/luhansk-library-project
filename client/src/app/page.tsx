import PostList from "@/components/PostList/PostList";
import Sidebar from "@/components/Sidebar/Sidebar"; // Переконайтесь, що створили цей компонент
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.homeGrid}>
      
      {/* Ліва частина: Новини */}
      <div className={styles.mainColumn}>
        <h1 className="text-3xl font-bold mb-6 text-[#c00000]">
          Новини та події
        </h1>
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