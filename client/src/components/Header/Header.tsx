"use client";

import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.scss";
import { useTheme } from "../../hooks/useTheme";
import { useWindowWidth } from "../../hooks/useWindowWidth";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { headerMenuItems } from "../../config/menus";

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuStatus, setMobileMenuStatus] = useState(false);
  const pathname = usePathname();
  const windowWidth = useWindowWidth();

  const breakpoint = 768;

  const getSiteTitle = () => {
    if (windowWidth <= breakpoint) {
      return "ЛОУНБ";
    }
    return "Луганська обласна універсальна наукова бібліотека";
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuStatus(prevStatus => !prevStatus);
  };
  
  useEffect(() => {
    if (windowWidth > breakpoint) {
      setMobileMenuStatus(false);
    }
  }, [windowWidth, breakpoint]);

    const getThemeButtonText = () => {
    if (theme === "light") return "Темна тема";
    if (theme === "dark") return "Сіра тема";
    if (theme === "grayscale") return "Світла тема";
    return "Змінити тему";
  };

  return (
    <header className={styles.header}>
      <div className="container container__header">
        <Link href="/" className={styles.brand}>
          <Image
            src="/logo.png"
            alt="Logo"
            width={70}
            height={70}
            className={styles.brand__logo}
          />
          <span className={styles.brand__siteName}>{getSiteTitle()}</span>
        </Link>
        <nav className={`${styles.nav} ${mobileMenuStatus ? styles.nav__active : ''}`}>
          {headerMenuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${styles.navLink} ${
                pathname === item.href ? styles.active : ""
              }`}
              onClick={() => setMobileMenuStatus(false)}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className={styles.specificControls}>
          <button onClick={() => toggleTheme()} className={styles.themeToggleBtn}>
          </button>
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