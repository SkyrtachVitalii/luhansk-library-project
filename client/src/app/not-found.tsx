import Link from "next/link";
import Image from "next/image";
import styles from "./not-found.module.scss";

export default function NotFound() {
  return (
    <>
      <h1 className={styles.heading}>404</h1>
      <h2 className={styles.subheading}>Сторінку не знайдено</h2>
      <p className={styles.text}>
        Вибачте, але сторінка, яку ви шукаєте, не існує або була переміщена.
      </p>
      <Link href="/" className={styles.link}>
        Повернутися на головну
      </Link>
      <Image
        src="/nf404.png"
        alt="Not Found"
        width={200}
        height={200}
        className={styles.image}
      />
    </>
  );
}
