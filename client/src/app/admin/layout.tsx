import { verifySession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { adminMenuItems, managerMenuItems } from "@/config/menus";
import Header from "@/components/Header/Header"; // 👇 Імпортуємо Хедер
import Footer from "@/components/Footer/Footer"; // 👇 Імпортуємо Футер
import AsideMenu from "@/components/AsideMenu/AsideMenu";
import styles from "./AdminPanel.module.scss";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();

  // 1. Перевірка доступу
  if (!session) redirect("/");
  if (session.role === "user") redirect("/e-catalog");

  // 2. Вибір меню
  const menuItems = session.role === "admin" ? adminMenuItems : managerMenuItems;

  return (
    // Використовуємо fluid-контейнер для адмінки, щоб було на всю ширину
<div className={styles.adminWrapper}>
      <Header />

      <div className={styles.mainSection}>
        
        <aside className={styles.sidebarArea}>
           <AsideMenu items={menuItems} />
           
        </aside>

        <main className={styles.contentArea}>
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}