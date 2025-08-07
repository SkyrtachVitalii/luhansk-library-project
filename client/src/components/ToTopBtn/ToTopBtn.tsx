"use client";

import { useState, useEffect } from "react";
import styles from "./ToTopBtn.module.scss";

const ToTopBtn = () => {
  const [showButton, setShowButton] = useState(false);
  const toTopBtnScrollDistance = 50; // Відстань, після якої кнопка з'являється

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > toTopBtnScrollDistance) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <>
      {showButton && (
        <button
          className={styles.toTopBtn}
          onClick={scrollToTop}
          aria-label="Прокрутити вгору"
        >
          <svg
            fill="#9f0000"
            xmlns="http://www.w3.org/2000/svg"
            width="24px"
            height="24px"
            viewBox="0 0 52 52"
            enable-background="new 0 0 52 52"
          >
            <g>
              <path d="M11.4,21.6L24.9,7.9c0.6-0.6,1.6-0.6,2.2,0l13.5,13.7c0.6,0.6,0.6,1.6,0,2.2L38.4,26   c-0.6,0.6-1.6,0.6-2.2,0l-9.1-9.4c-0.6-0.6-1.6-0.6-2.2,0l-9.1,9.3c-0.6,0.6-1.6,0.6-2.2,0l-2.2-2.2C10.9,23.1,10.9,22.2,11.4,21.6   z" />
              <path d="M11.4,39.7L24.9,26c0.6-0.6,1.6-0.6,2.2,0l13.5,13.7c0.6,0.6,0.6,1.6,0,2.2l-2.2,2.2   c-0.6,0.6-1.6,0.6-2.2,0l-9.1-9.4c-0.6-0.6-1.6-0.6-2.2,0L15.8,44c-0.6,0.6-1.6,0.6-2.2,0l-2.2-2.2C10.9,41.2,10.9,40.2,11.4,39.7z   " />
            </g>
          </svg>
        </button>
      )}
    </>
  );
};
export default ToTopBtn;
