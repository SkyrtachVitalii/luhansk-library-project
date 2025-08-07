'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeContextType, ThemeProviderProps } from '../types';

// Створюємо контекст з початковими значеннями за замовчуванням
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  // Ініціалізуємо тему з локального сховища або за замовчуванням
  const [theme, setTheme] = useState<string>(''); // 'light', 'dark', 'grayscale'

  useEffect(() => {
    // При завантаженні застосунку перевіряємо, чи є збережена тема в localStorage
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.body.className = savedTheme === 'grayscale' ? 'theme-grayscale' : '';
    } else {
      // Якщо немає, визначаємо тему на основі системних налаштувань
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []); // Пустий масив залежностей означає, що ефект запускається один раз при монтажі

  useEffect(() => {
    // Коли тема змінюється, оновлюємо клас на body та зберігаємо в localStorage
    if (theme) {
      document.body.className = theme === 'grayscale' ? 'theme-grayscale' : '';
      localStorage.setItem('app-theme', theme);
    }
  }, [theme]);

  // Функція для перемикання теми
  const toggleTheme = (newTheme?: string) => {
    setTheme(prevTheme => {
      // Якщо вказано конкретну тему, використовуємо її
      if (newTheme) return newTheme;

      // Якщо не вказано, перемикаємо між light, dark та grayscale
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'grayscale';
      return 'light'; // Повертаємося до світлої
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};