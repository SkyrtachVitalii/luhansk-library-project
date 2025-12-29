// Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.scss";
import { useTheme } from "../../hooks/useTheme";
import { useWindowWidth } from "../../hooks/useWindowWidth"; // Можна видалити, якщо більше ніде не юзається
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { headerMenuItems } from "../../config/menus";

const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuStatus, setMobileMenuStatus] = useState(false);
  const pathname = usePathname();
  const windowWidth = useWindowWidth(); // Можна видалити, якщо використовувався тільки для заголовка
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false); // Тимчасово, поки немає реального стану авторизації
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Проста перевірка: чи є кука або токен в localStorage?
    // Тобі треба адаптувати це під свій метод збереження входу
    // Наприклад:
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (data.isAuth) {
          setIsAuth(true);
          setUserName(data.user?.name || "Guest");
        } else {
          setIsAuth(false);
          setUserName(null);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuth(false);
      }
    };
    checkAuth();
    window.addEventListener("auth-change", checkAuth);

    // Прибираємо слухача, коли компонент зникає (cleanup)
    return () => {
      window.removeEventListener("auth-change", checkAuth);
    };
  }, [pathname]); // Запускається 1 раз при завантаженні

  const breakpoint = 768;

  const toggleMobileMenu = () => {
    setMobileMenuStatus((prevStatus) => !prevStatus);
  };

  useEffect(() => {
    if (windowWidth > breakpoint) {
      setMobileMenuStatus(false);
    }
  }, [windowWidth, breakpoint]);

  useEffect(() => {
    if (!headerRef.current) return;

    const updateHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        // Записуємо змінну прямісінько в стиль кореневого елемента
        document.documentElement.style.setProperty(
          "--header-height",
          `${height}px`
        );
      }
    };

    // 1. Вимірюємо одразу
    updateHeight();

    // 2. Слідкуємо за зміною розміру саме цього елемента
    const observer = new ResizeObserver(updateHeight);
    observer.observe(headerRef.current);

    return () => observer.disconnect();
  }, []);

  // 2. ЛОГІКА ВИХОДУ
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      // Після виходу оновлюємо стан авторизації
      setIsAuth(false);
      setUserName(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const visibleMenuItems = headerMenuItems.filter((item) => {
    if (isAuth) {
      return item.id !== "login";
    } else {
      return item.id !== "logout";
    }
  });

  return (
    <header className={styles.header} ref={headerRef}>
      <div className="container container__header">
        <Link href="/" className={styles.brand}>
          <Image
            src="/logo.png"
            alt="Logo"
            width={70}
            height={70}
            className={styles.brand__logo}
          />

          {/* --- ЗМІНИ ТУТ: Виводимо обидва варіанти тексту з різними класами --- */}

          {/* Цей текст видно на Desktop, сховано на Mobile */}
          <span
            className={`${styles.brand__siteName} ${styles.brand__siteNameDesktop}`}
          >
            Луганська обласна універсальна наукова бібліотека
          </span>

          {/* Цей текст видно на Mobile, сховано на Desktop */}
          <span
            className={`${styles.brand__siteName} ${styles.brand__siteNameMobile}`}
          >
            ЛОУНБ
          </span>

          {/* ------------------------------------------------------------------ */}
        </Link>
        <nav
          className={`${styles.nav} ${
            mobileMenuStatus ? styles.nav__active : ""
          }`}
        >
          {visibleMenuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${styles.navLink} ${
                pathname === item.href ? styles.active : ""
              }`}
              onClick={(e) => {
                setMobileMenuStatus(false);
                if (item.id === "login") {
                  e.preventDefault(); // Зупиняємо стандартний перехід Next.js

                  // Вручну ставимо хеш, що гарантовано запустить подію 'hashchange'
                  window.location.hash = "login";
                }
                if (item.id === "logout") {
                  e.preventDefault();
                  handleLogout();
                }
              }}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className={styles.specificControls}>
          <button
            onClick={() => toggleTheme()}
            className={styles.themeToggleBtn}
          ></button>
          <button onClick={toggleMobileMenu} className={styles.navToggleMobile}>
            <span className={styles.navToggleMobile__span}></span>
            <span className={styles.navToggleMobile__span}></span>
            <span className={styles.navToggleMobile__span}></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
