import Image from "next/image";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <>
      <h1>Привіт, бібліотека Луганська!</h1>
      <p>Тут буде контент головної сторінки.</p>
      <div style={{ minHeight: "600px" }}>
        This is a paragraph with inline styles.
      </div>
    </>
  );
}
