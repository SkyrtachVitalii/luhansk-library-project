"use client";

import { useState } from "react";
import styles from "./AddNewUser.module.scss";
import { usersApi } from "../../api/users";

interface AddNewUserProps {
  onClose: () => void;
  onSuccess?: () => void; // Функція для оновлення списку після успіху
}

export default function AddNewUser({ onClose, onSuccess }: AddNewUserProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Стейт форми (тільки основні поля для старту)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "", // Пароль обов'язковий при створенні
    role: "user",
    phone: "",
    gender: "Male",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await usersApi.createUser(formData);

      alert("Користувача створено успішно!");
      if (onSuccess) onSuccess(); // Оновлюємо таблицю
      onClose(); // Закриваємо модалку

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Щось пішло не так. Перевірте дані.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      {/* stopPropagation щоб клік по модалці не закривав її */}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        <div className={styles.header}>
          <h2>Новий користувач</h2>
          <button className={styles.closeBtn} onClick={onClose} title="Закрити">×</button>
        </div>

        <div className={styles.body}>
          {error && <div className={styles.errorMsg}>{error}</div>}

          <form id="addUserForm" onSubmit={handleSubmit} className={styles.formGrid}>

            {/* Основна інформація */}
            <div className={styles.formGroup}>
              <label>Ім&apos;я *</label>
              <input required name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Тарас" />
            </div>

            <div className={styles.formGroup}>
              <label>Прізвище *</label>
              <input required name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Шевченко" />
            </div>

            <div className={styles.formGroup}>
              <label>Email (Логін) *</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="user@example.com" />
            </div>

            <div className={styles.formGroup}>
              <label>Пароль *</label>
              <input required type="password" name="password" value={formData.password} onChange={handleChange} placeholder="******" />
            </div>

            <div className={styles.formGroup}>
              <label>Телефон</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+380..." />
            </div>

            <div className={styles.formGroup}>
              <label>Стать</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label>Роль у системі</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="user">Читач (User)</option>
                <option value="manager">Бібліотекар (Manager)</option>
                <option value="admin">Адміністратор (Admin)</option>
              </select>
            </div>

          </form>
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.btnCancel} onClick={onClose}>
            Скасувати
          </button>
          <button
            type="submit"
            form="addUserForm" // Прив'язка до форми через ID
            className={styles.btnSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Збереження..." : "Створити користувача"}
          </button>
        </div>

      </div>
    </div>
  );
}