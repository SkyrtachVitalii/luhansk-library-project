"use client";

import Link from "next/link";
import styles from "./Footer.module.scss";

import Socials from "@/components/Socials/Socials";
import SocialsHelp from "@/components/SocialsHelp/SocialsHelp";
import FooterColumnMenus1 from "@/components/FooterColumnMenus/FooterColumnMenus1";
import FooterColumnMenus2 from "@/components/FooterColumnMenus/FooterColumnMenus2";
import FooterColumnMenus3 from "@/components/FooterColumnMenus/FooterColumnMenus3";

const Footer = () => {

  const startYear = 2017; // Assuming the library started in 2017
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footerDecor}>
      <div className="container">
        <div className={styles.footer}>
          <div className={`${styles.footer__column} ${styles.footer__column1}`}>
            <Socials />
            <SocialsHelp />
          </div>
          <div className={`${styles.footer__column} ${styles.footer__column2}`}>
            <FooterColumnMenus1 />
          </div>
          <div className={`${styles.footer__column} ${styles.footer__column3}`}>
            <FooterColumnMenus2 />
          </div>
          <div className={`${styles.footer__column} ${styles.footer__column4}`}>
            <FooterColumnMenus3 />
          </div>
          <div className={`${styles.footer__column} ${styles.footer__column5}`}>
            <Link
              className={styles.footer__customLink}
              href={
                "https://www.google.com/maps/place/%D0%A7%D0%B5%D1%80%D0%BA%D0%B0%D1%81%D1%8C%D0%BA%D0%B0+%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D0%BD%D0%B0+%D0%B1%D1%96%D0%B1%D0%BB%D1%96%D0%BE%D1%82%D0%B5%D0%BA%D0%B0+%D0%B4%D0%BB%D1%8F+%D0%B4%D1%96%D1%82%D0%B5%D0%B9/@49.4474568,32.05637,18z/data=!4m6!3m5!1s0x40d14c8316e9b75b:0x165b7f03211036a9!8m2!3d49.4475269!4d32.0567027!16s%2Fg%2F11b6j7zmf1?entry=ttuuk"
              }
              target="_blank"
            >
              м. Черкаси, вул. Святотроїцька, 24
            </Link>
            <Link
              className={styles.footer__customLink}
              href={`mailto:${"Info@library.lg.ua"}`}
              target="_blank"
            >
              Info@library.lg.ua
            </Link>
            <Link
              className={styles.footer__customLink}
              href={`tel:${"+380662610598"}`}
              target="_blank"
            >
              +38(066) 261-05-98
            </Link>
            <Link
              className={styles.footer__customLink}
              href="/about"
              target="_blank"
            >
              пн-нд: без вихідних <br />
              працюємо онлайн
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.footer__copyright}>{startYear} - {currentYear}</div>
    </footer>
  );
};

export default Footer;
