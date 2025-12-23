"use client";

import React, { useEffect, useState } from "react"; // <--- Додали хуки
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuItem } from "@/types";
import styles from "./AsideMenu.module.scss";

interface AsideMenuProps {
  items: MenuItem[];
}

const AsideMenu: React.FC<AsideMenuProps> = ({ items }) => {
  const pathname = usePathname();

  // 1. Стейт для зберігання поточного якоря (наприклад, "#stat")
  const [currentHash, setCurrentHash] = useState("");

  // 2. Слідкуємо за зміною хешу в адресному рядку
  useEffect(() => {
    // Встановлюємо початкове значення (бо на сервері window не існує)
    setCurrentHash(window.location.hash);

    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    // Слухаємо подію зміни хешу
    window.addEventListener("hashchange", handleHashChange);

    // Також слухаємо клік, щоб оновити стан миттєво (для кращого UX)
    window.addEventListener("click", () => {
      // Невелика затримка, щоб URL встиг оновитися
      setTimeout(() => setCurrentHash(window.location.hash), 50);
    });

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const isActive = (itemHref: string) => {
    // Формуємо повний поточний шлях (шлях + якір)
    const currentFullUrl = pathname + currentHash;

    // 1. Повне точне співпадіння (Пріоритет №1)
    // Наприклад: item="/reports#stat" === current="/reports#stat" -> TRUE
    if (itemHref === currentFullUrl) {
      return true;
    }

    // 2. Співпадіння по шляху, АЛЕ тільки якщо немає активного хешу (Пріоритет №2)
    // Це для пункту "/reports". Він буде активним, тільки якщо ми просто на "/reports",
    // а не на "/reports#stat"
    if (itemHref === pathname && currentHash === "") {
      return true;
    }

    return false;
  };

  return (
    <nav className={styles.menuContainer}>
      {items.map((item) => {
        const isExternal = item.href.startsWith("http");
        // Обчислюємо активний стан
        const activeClass = isActive(item.href) ? styles.active : "";

        if (isExternal) {
          return (
            <a
              key={item.id}
              href={item.href}
              className={`${styles.menuItem} ${activeClass}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.name}
            </a>
          );
        }

        return (
          <Link
            key={item.id}
            href={item.href}
            className={`${styles.menuItem} ${activeClass}`}
            // Додатково оновлюємо хеш при кліку вручну
            onClick={() => {
              if (item.href.startsWith("#")) setCurrentHash(item.href);
            }}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default AsideMenu;
