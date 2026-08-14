import { getSession } from "@/api/auth.server";
import styles from "./AdminPanel.module.scss";
import { redirect } from "next/navigation";

export default async function AdminPanel() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  if (session.role === "user") {
    redirect("/e-catalog");
  }

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminCard}>
        <h1>⚙️ Адмін-панель</h1>
        <p>
          Вітаємо, <strong>{session.firstName}</strong>!
        </p>
        <p className={styles.roleBadge}>Ваша роль: {session.role}</p>

        <div className={styles.placeholderContent}>
          <p>Тут скоро будуть інструменти керування бібліотекою...</p>
        </div>
      </div>
    </div>
  );
}
