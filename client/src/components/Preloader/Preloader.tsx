// client/src/components/Preloader/Preloader.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Preloader.module.scss';

interface PreloaderProps {
  isLoading?: boolean;       // Стан завантаження даних
  minDisplayTime?: number;   // Мінімальний час показу (за замовчуванням 2000мс)
  type?: 'full' | 'local';   // Тип
  className?: string;
  children?: React.ReactNode; // Контент сторінки
}

const Preloader: React.FC<PreloaderProps> = ({ 
  isLoading = true, 
  minDisplayTime = 2000, 
  type = 'local', 
  className = '',
  children
}) => {
  // Стан: чи пройшов мінімальний час?
  const [isMinTimeElapsed, setIsMinTimeElapsed] = useState(false);

  useEffect(() => {
    // Запускаємо таймер при монтуванні компонента
    const timer = setTimeout(() => {
      setIsMinTimeElapsed(true);
    }, minDisplayTime);

    return () => clearTimeout(timer);
  }, [minDisplayTime]);

  // Головна умова: показуємо лоадер, якщо (Дані вантажаться) АБО (Час не вийшов)
  const shouldShowPreloader = isLoading || !isMinTimeElapsed;

  // Якщо треба показувати прелоадер
  if (shouldShowPreloader) {
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

  // Якщо завантаження завершено і час вийшов — показуємо контент
  return <>{children}</>;
};

export default Preloader;