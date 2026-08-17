// Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.scss";
import { useTheme } from "next-themes";
import { useAccessibility } from "@/hooks/useAccessibility";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Moon, Sun, Accessibility, ZoomIn, ZoomOut, Settings2, RefreshCcw } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { headerMenuItems } from "../../config/menus";
import { authApi } from "../../api/auth";

const Header = () => {
  const headerRef = useRef<HTMLElement>(null);
  const { theme, setTheme } = useTheme();
  const { isGrayscale, toggleGrayscale, increaseFontSize, decreaseFontSize, resetAccessibility } = useAccessibility();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);
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
  }, [pathname]);

  useEffect(() => {
    if (!headerRef.current) return;

    const updateHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty(
          "--header-height",
          `${height}px`
        );
      }
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(headerRef.current);

    return () => observer.disconnect();
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
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
      <div className={`container ${styles.headerContainer}`}>
        <Link href="/" className={styles.brand}>
          <Image
            src="/logo.png"
            alt="Logo"
            width={70}
            height={70}
            className={styles.brand__logo}
          />
          <span
            className={`${styles.brand__siteName} ${styles.brand__siteNameDesktop}`}
          >
            Луганська обласна універсальна наукова бібліотека
          </span>
          <span
            className={`${styles.brand__siteName} ${styles.brand__siteNameMobile}`}
          >
            ЛОУНБ
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          {visibleMenuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${styles.navLink} ${
                pathname === item.href ? styles.active : ""
              }`}
              onClick={(e) => {
                if (item.id === "login") {
                  e.preventDefault();
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

        <div className={styles.controlsGroup}>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={styles.themeBtn}
            title="Перемкнути тему"
            type="button"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger
              title="Налаштування доступності"
              className={styles.accessibilityBtn}
            >
              <Accessibility className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-[1050]">
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

          {/* Mobile Navigation Sheet */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger
              className={`${styles.navToggleMobile} md:hidden`}
              type="button"
              aria-label="Меню"
            >
              <span className={styles.navToggleMobile__span}></span>
              <span className={styles.navToggleMobile__span}></span>
              <span className={styles.navToggleMobile__span}></span>
            </SheetTrigger>
            <SheetContent
              side="top"
              showClose={true}
              className="bg-[var(--accent-color1)] border-b border-[var(--header-control-border)] p-6 shadow-2xl text-[var(--foreground-header)]"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[var(--header-control-border)]">
                <div className="flex items-center gap-3">
                  <Image src="/logo.png" alt="Logo" width={40} height={40} />
                  <span className="font-semibold text-lg text-[var(--foreground-header)]">
                    ЛОУНБ
                  </span>
                </div>
              </div>
              <SheetTitle className="sr-only">Мобільне меню навігації</SheetTitle>
              <nav className="flex flex-col gap-2 font-medium text-base">
                {visibleMenuItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`py-3 px-4 rounded-lg transition-all ${
                      pathname === item.href
                        ? "bg-[var(--accessibility-btn-bg)] text-[var(--accent-color1)] font-bold shadow-md"
                        : "text-[var(--foreground-header)] hover:bg-[var(--header-btn-hover-bg)]"
                    }`}
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      if (item.id === "login") {
                        e.preventDefault();
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
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
