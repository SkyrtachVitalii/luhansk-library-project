"use client";

import Link from "next/link";
import styles from "./FooterColumnMenus.module.scss";

import { footerMenuItemsColumn2 } from "@/config/menus";

const FooterColumnMenus2 = () => {
  return (
    <>
      <div className={styles.footerColumnMenu__title}>Про бібліотеку</div>
      <nav className={styles.footerColumnMenu}>
        {footerMenuItemsColumn2.map((link) => (
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

export default FooterColumnMenus2;
