"use client";

import Link from "next/link";
import styles from "./FooterColumnMenus.module.scss";

import { footerMenuItemsColumn1 } from "@/config/menus";

const FooterColumnMenus1 = () => {
  return (
    <>
      <div className={styles.footerColumnMenu__title}>Меню</div>
      <nav className={styles.footerColumnMenu}>
        {footerMenuItemsColumn1.map((link) => (
          <Link
            key={link.id}
            href={link.href}
            className={styles.footerColumnMenu__link}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </>
  );
};

export default FooterColumnMenus1;
