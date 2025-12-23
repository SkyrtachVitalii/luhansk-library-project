"use client";

import React, { useEffect, useRef, useMemo } from 'react';
import { fixLegacyContent } from '@/utils/fixLegacyContent'; // <--- Імпорт нашої утиліти

interface SafeHTMLProps {
  html: string;
  className?: string;
}

const SafeHTML: React.FC<SafeHTMLProps> = ({ html, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. ФІКСИМО ПОСИЛАННЯ (Миттєво, через useMemo)
  // useMemo гарантує, що функція спрацює тільки коли зміниться вхідний html string
  const processedHtml = useMemo(() => {
    return fixLegacyContent(html);
  }, [html]);

  // 2. ФІКСИМО АКОРДЕОНИ (Після рендеру)
  useEffect(() => {
    if (!containerRef.current) return;

    const toggles = containerRef.current.querySelectorAll('[data-toggle="collapse"]');

    const handleClick = (e: Event) => {
      e.preventDefault();
      const trigger = e.currentTarget as HTMLAnchorElement;
      
      const targetId = trigger.getAttribute('href') || trigger.getAttribute('data-target');
      if (!targetId) return;

      // Шукаємо елемент всередині нашого контейнера або глобально
      const targetElement = containerRef.current?.querySelector(targetId) || document.querySelector(targetId);
      
      if (targetElement) {
        const isExpanded = targetElement.classList.contains('in') || targetElement.classList.contains('show');

        if (isExpanded) {
          targetElement.classList.remove('in', 'show');
          trigger.setAttribute('aria-expanded', 'false');
        } else {
          // Закриваємо сусідів (опціонально)
          const parentSelector = trigger.getAttribute('data-parent');
          if (parentSelector) {
             const parent = document.querySelector(parentSelector);
             if (parent) {
               const openedSiblings = parent.querySelectorAll('.collapse.in, .collapse.show');
               openedSiblings.forEach(sibling => {
                 sibling.classList.remove('in', 'show');
               });
             }
          }

          targetElement.classList.add('in', 'show');
          trigger.setAttribute('aria-expanded', 'true');
        }
      }
    };

    toggles.forEach(toggle => toggle.addEventListener('click', handleClick));

    return () => {
      toggles.forEach(toggle => toggle.removeEventListener('click', handleClick));
    };
  }, [processedHtml]); // Залежність тепер від обробленого HTML

  return (
    <div 
      ref={containerRef}
      className={`content-body ${className}`} 
      // Вставляємо вже виправлений HTML з правильними посиланнями
      dangerouslySetInnerHTML={{ __html: processedHtml }} 
    />
  );
};

export default SafeHTML;