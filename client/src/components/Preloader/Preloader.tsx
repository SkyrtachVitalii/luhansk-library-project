"use client";

import React, { useState, useEffect } from 'react';
import {MIN_PRELOADER_TIME} from '@/config/constants';
import Image from 'next/image';
import styles from './Preloader.module.scss';
import { PreloaderProps } from "@/types";

const Preloader: React.FC<PreloaderProps> = ({ 
  isLoading = true, 
  minDisplayTime = MIN_PRELOADER_TIME, 
  type = 'local', 
  className = '',
  children
}) => {
  // 1. Стейт таймера
  const [isMinTimeElapsed, setIsMinTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMinTimeElapsed(true);
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [minDisplayTime]);

  // 2. Визначаємо, чи готовий контент до показу
  // Контент готовий, коли дані завантажились І пройшов мінімальний час анімації
  const isContentReady = !isLoading && isMinTimeElapsed;

  // 3. === ГЛОБАЛЬНА ЛОГІКА СКРОЛУ ===
  useEffect(() => {
    // Спрацьовує тільки тоді, коли контент нарешті з'явився
    if (isContentReady) {
      const hash = window.location.hash;
      
      if (hash) {
        // Робимо мікро-затримку (100мс), щоб React встиг "намалювати" HTML у DOM
        // після того, як ми прибрали прелоадер
        setTimeout(() => {
          try {
            // Декодуємо хеш (на випадок кирилиці в URL) і прибираємо #
            const id = decodeURIComponent(hash.replace('#', ''));
            const element = document.getElementById(id);

            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          } catch (e) {
            console.error("Помилка скролу:", e);
          }
        }, 100);
      }
    }
  }, [isContentReady]); // Залежність: запускати, коли контент стає готовим

  
  // 4. Логіка рендеру
  // Поки контент НЕ готовий — показуємо Логотип
  if (!isContentReady) {
    const containerClass = `${styles.container} ${
      type === 'full' ? styles.fullScreen : styles.local
    } ${className}`;

    return (
      <div className={containerClass}>
        <div className={styles.pulsingLogo}>
          <Image 
            src="/logo.png" 
            alt="Loading..." 
            fill 
            sizes="150px"
            priority 
          />
        </div>
      </div>
    );
  }

  // Коли готовий — показуємо дітей
  return <>{children}</>;
};

export default Preloader;