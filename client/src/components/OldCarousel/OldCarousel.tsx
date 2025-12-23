"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import styles from "./OldCarousel.module.scss";

interface OldCarouselProps {
  images: string[];
}

export default function OldCarousel({ images }: OldCarouselProps) {
  // --- 1. ОГОЛОШУЄМО ВСІ ХУКИ НА ПОЧАТКУ (Це важливо!) ---

  const trackRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Починаємо з індексу 1 (перший реальний слайд), але це має сенс тільки якщо слайдів > 1
  const [currentIndex, setCurrentIndex] = useState(1);

  // Створюємо масив із клонами безпечно.
  // Якщо зображень немає або < 2, повертаємо порожній масив або оригінал, щоб код не впав
  const extendedImages = useMemo(() => {
    if (!images || images.length < 2) return [];
    return [images[images.length - 1], ...images, images[0]];
  }, [images]);

  // Функція переміщення
  const moveToSlide = useCallback((index: number, duration = 1) => {
    if (!trackRef.current || extendedImages.length === 0) return;
    
    setIsAnimating(true);
    
    const percentPerSlide = 100 / extendedImages.length;
    
    gsap.to(trackRef.current, {
      xPercent: -(percentPerSlide * index),
      duration: duration,
      ease: "power2.inOut",
      onComplete: () => {
        setIsAnimating(false);
        
        // Логіка Infinite Loop
        if (index === extendedImages.length - 1) {
          const realFirstIndex = 1;
          setCurrentIndex(realFirstIndex);
          gsap.set(trackRef.current, { xPercent: -(percentPerSlide * realFirstIndex) });
        } else if (index === 0) {
          const realLastIndex = extendedImages.length - 2;
          setCurrentIndex(realLastIndex);
          gsap.set(trackRef.current, { xPercent: -(percentPerSlide * realLastIndex) });
        } else {
          setCurrentIndex(index);
        }
      },
    });
  }, [extendedImages.length]);

  // Ініціалізація позиції
  useEffect(() => {
    if (trackRef.current && extendedImages.length > 0) {
      const percentPerSlide = 100 / extendedImages.length;
      // Ставимо на 1-й слайд (реальний перший)
      gsap.set(trackRef.current, { xPercent: -(percentPerSlide * 1) });
    }
  }, [extendedImages.length]);

  // --- 2. ТЕПЕР МОЖНА РОБИТИ EARLY RETURN (Умови виходу) ---

  // Варіант А: Немає картинок
  if (!images || images.length === 0) return null;

  // Варіант Б: Тільки одна картинка (слайдер не потрібен)
  if (images.length === 1) {
    return (
      <div className={styles.carouselWrapper}>
        <div className={styles.carouselWindow}>
          <div className={styles.imageContainer}>
            <Image 
              src={images[0]} 
              alt="Single slide" 
              fill 
              className={styles.image} 
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        </div>
      </div>
    );
  }

  // --- 3. ЛОГІКА ОБРОБНИКІВ (Handler functions) ---
  // (Оголошуємо тут, бо вони використовуються в JSX нижче)

  const handleNext = () => {
    if (isAnimating) return;
    moveToSlide(currentIndex + 1);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    moveToSlide(currentIndex - 1);
  };

  const handleDotClick = (realIndex: number) => {
    if (isAnimating) return;
    moveToSlide(realIndex + 1);
  };

  // Розрахунок активної крапки
  const getActiveDotIndex = () => {
    if (currentIndex === 0) return images.length - 1; 
    if (currentIndex === extendedImages.length - 1) return 0;
    return currentIndex - 1;
  };

  // --- 4. ГОЛОВНИЙ РЕНДЕР ---
  return (
    <div className={styles.carouselWrapper}>
      <div className={styles.carouselWindow}>
        <div 
          className={styles.track} 
          ref={trackRef}
          style={{ width: `${extendedImages.length * 100}%` }}
        >
          {extendedImages.map((src, idx) => (
            <div 
              key={idx} 
              className={styles.slide}
              style={{ width: `${100 / extendedImages.length}%` }}
            >
              <div className={styles.imageContainer}>
                <Image
                  src={src}
                  alt={`Slide`}
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority={idx === 1}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className={`${styles.control} ${styles.left}`} onClick={handlePrev}>‹</button>
      <button className={`${styles.control} ${styles.right}`} onClick={handleNext}>›</button>

      <div className={styles.indicators}>
        {images.map((_, idx) => (
          <button
            key={idx}
            className={`${styles.dot} ${getActiveDotIndex() === idx ? styles.active : ""}`}
            onClick={() => handleDotClick(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}