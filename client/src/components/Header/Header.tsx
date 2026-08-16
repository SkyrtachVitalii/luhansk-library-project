// Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.scss";
import { useTheme } from "next-themes";
import { useAccessibility } from "@/hooks/useAccessibility";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Accessibility, ZoomIn, ZoomOut, Settings2, RefreshCcw } from "lucide-react";
import { useWindowWidth } from "../../hooks/useWindowWidth"; // Можна видалити, якщо більше ніде не юзається
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { headerMenuItems } from "../../config/menus";
import { authApi } from "../../api/auth";

const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const { theme, setTheme } = useTheme();
  const { isGrayscale, toggleGrayscale, increaseFontSize, decreaseFontSize, resetAccessibility } = useAccessibility();
  const [mobileMenuStatus, setMobileMenuStatus] = useState(false);
  const pathname = usePathname();
  const windowWidth = useWindowWidth(); // Можна видалити, якщо використовувався тільки для заголовка
  const [isAuth, setIsAuth] = useState(false); // Тимчасово, поки немає реального стану авторизації
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const checkAuth = async () => {
      try {
        const data = await authApi.me();

        if (data && data.user) {
          setIsAuth(true);
          const { firstName, lastName, email } = data.user;
          const fullName = `${lastName || ''} ${firstName || ''}`.trim();
          setUserName(fullName || email || 'Guest');
        } else {
          setIsAuth(false);
          setUserName(null);
        }
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error("Error checking auth status:", error);
          setIsAuth(false);
          setUserName(null);
        }
      }
    };

    checkAuth();
    window.addEventListener("auth-change", checkAuth);

    return () => {
      controller.abort();
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
      await authApi.logout();
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
        <div className="flex items-center gap-2 md:fixed md:right-0 md:top-4 md:flex-col md:z-[10000] md:bg-background md:p-2 md:rounded-l-lg md:shadow-md md:border md:border-r-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-10 h-10 md:w-12 md:h-12"
            title="Перемкнути тему"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger title="Доступність" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground w-10 h-10 md:w-12 md:h-12">
              <img src="/accessibility.png" alt="Доступність" className="h-5 w-5 md:h-7 md:w-7 object-contain" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={toggleGrayscale}>
                <Settings2 className="mr-2 h-4 w-4" />
                <span>{isGrayscale ? "Вимкнути відтінки сірого" : "Відтінки сірого"}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={increaseFontSize}>
                <ZoomIn className="mr-2 h-4 w-4" />
                <span>Збільшити текст (A+)</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={decreaseFontSize}>
                <ZoomOut className="mr-2 h-4 w-4" />
                <span>Зменшити текст (A-)</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={resetAccessibility}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                <span>Скинути налаштування</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button onClick={toggleMobileMenu} className={`${styles.navToggleMobile} md:hidden`}>
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
