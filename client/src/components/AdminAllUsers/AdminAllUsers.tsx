"use client";

import styles from "./AdminAllUsers.module.scss";
import Link from "next/link";
import { usersApi } from "../../api/users";
import { tableUserData } from "@/types";

interface AdminAllUsersProps {
  users: tableUserData[];
  isSuperAdmin: boolean; // Тільки адмін бачить кнопку "Додати" і "Видалити"
}

export default function AdminAllUsers({ users, isSuperAdmin }: AdminAllUsersProps) {
  
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Ви впевнені, що хочете видалити користувача "${name}"?`)) return;
    
    try {
      await usersApi.deleteUser(id);
      window.location.reload();
    } catch (err) {
      alert("Помилка під час видалення");
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Користувачі</h1>
        {isSuperAdmin && (
          <Link href="/admin/add-user" className={styles.btnAdd}>
            <span>+</span> Додати користувача
          </Link>
        )}
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Логін (Email)</th>
              <th>ПІ</th>
              <th>Роль</th>
              <th>Створено</th>
              <th>Змінено</th>
              <th>Редагувати</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>
                  <strong>{user.email}</strong>
                </td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{new Date(user.createdAt).toLocaleDateString("uk-UA")}</td>
                <td>{new Date(user.updatedAt).toLocaleDateString("uk-UA")}</td>
                <td className={styles.actions}>
                  {/* Кнопка Редагувати (доступна всім, хто бачить таблицю) */}
                  <Link href={`/admin/edit-user/${user._id}`} className={`${styles.iconBtn} ${styles.edit}`} title="Редагувати">
                    ✎
                  </Link>

                  {/* Кнопка Видалити (Тільки Адмін) */}
                  {isSuperAdmin && (
                    <button 
                      onClick={() => handleDelete(user._id, user.name)}
                      className={`${styles.iconBtn} ${styles.delete}`}
                      title="Видалити"
                    >
                      ✖
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={{ fontSize: "0.9rem", color: "#666", padding: "10px" }}>
        Показано {users.length} записів.
      </div>
    </div>
  );
}