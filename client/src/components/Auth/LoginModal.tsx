// LoginModal.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./LoginModal.module.scss";

export default function LoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    login: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      setIsOpen(window.location.hash === "#login");
    };

    handleHashChange(); // Перевірка при завантаженні
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const closeModal = () => {
    // 1. Прибираємо хеш з URL (тихо, без перезавантаження)
    history.pushState(
      null,
      document.title,
      window.location.pathname + window.location.search
    );
    // 2. Сповіщаємо інші компоненти (якщо треба)
    window.dispatchEvent(new Event("hashchange"));
    // 3. Закриваємо модалку локально
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("Login data:", formData);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.login,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      console.log("Login successful:", data);

      window.dispatchEvent(new Event("auth-change"));

      closeModal();
      router.refresh();
    } catch (error) {
      setError("Помилка під час входу.");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 ОСЬ ЦЕЙ РЯДОК ВИПРАВЛЯЄ ПРОБЛЕМУ 🔥
  // Якщо вікно закрите - ми просто нічого не малюємо
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={closeModal}>
          &times;
        </button>

        <h2>Вхід</h2>

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="text"
              value={formData.login}
              onChange={(e) =>
                setFormData({ ...formData, login: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Пароль</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="remember"
              checked={formData.rememberMe}
              onChange={(e) =>
                setFormData({ ...formData, rememberMe: e.target.checked })
              }
            />
            <label htmlFor="remember">Запам&apos;ятати</label>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <a href="/register" className={styles.registerLink}>
              ® Реєстрація
            </a>
            <button
              type="submit"
              className={styles.loginBtn}
              disabled={loading}
            >
              {loading ? "Вхід..." : "➜ Увійти"}
            </button>
          </div>

          <div className={styles.bottomButtons}>
            {/* Тип button обов'язковий, щоб не сабмітило форму */}
            <button
              type="button"
              onClick={closeModal}
              className={styles.cancelBtn}
            >
              ✖ Відмінити
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
