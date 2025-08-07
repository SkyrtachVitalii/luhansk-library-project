"use client";

import Link from "next/link";
import styles from "./FooterColumnMenus.module.scss";

import { footerMenuItemsColumn3 } from "@/config/menus";

const FooterColumnMenus3 = () => {
  return (
    <>
      <div className={styles.footerColumnMenu__title}>Бібліотекарю</div>
      <nav className={styles.footerColumnMenu}>
        {footerMenuItemsColumn3.map((link) => (
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

export default FooterColumnMenus3;
