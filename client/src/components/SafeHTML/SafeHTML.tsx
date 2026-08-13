"use client";

import React, { useEffect, useRef, useMemo } from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { fixLegacyContent } from '@/utils/fixLegacyContent';

interface SafeHTMLProps {
  html: string;
  className?: string;
}

const SafeHTML: React.FC<SafeHTMLProps> = ({ html, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. ФІКСИМО ПОСИЛАННЯ ТА САНІТИЗУЄМО HTML ВІД XSS
  const processedHtml = useMemo(() => {
    if (!html) return '';
    const fixed = fixLegacyContent(html);
    return DOMPurify.sanitize(fixed, {
      ADD_ATTR: ['target', 'rel'],
    });
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
  }, [processedHtml]);

  return (
    <div 
      ref={containerRef}
      className={`content-body ${className}`} 
      dangerouslySetInnerHTML={{ __html: processedHtml }} 
    />
  );
};

export default SafeHTML;