"use client";

import React from 'react';
import { useGetPostsQuery } from '@/lib/redux/services/postsApi';
import Preloader from '@/components/Preloader/Preloader';
import AsideMenu from '@/components/AsideMenu/AsideMenu';
import { aboutSidebarMenu } from '@/config/menus'; // Ваше меню "Про бібліотеку"

export default function HistoryPage() {
  // 1. Запит: шукаємо 1 запис категорії "history" українською мовою
  const { data, isLoading, error } = useGetPostsQuery({
    category: 'history', // Переконайтеся, що в базі категорія саме 'history' (маленькими)
    lang: 'uk',          // Шукаємо в originalData.lang
    limit: 1,
  });

  // 2. Отримуємо пост (це масив, тому беремо нульовий елемент)
  const post = data?.data?.[0];

  if (error) {
    return <div className="container py-10 text-center text-red-500">Помилка завантаження даних.</div>;
  }

  return (
    // Використовуємо наш Smart Preloader
    <Preloader isLoading={isLoading} type="local">
      <div className="container py-10">
        
        {/* Використовуємо глобальну сітку з globals.scss */}
        <div className="layout-grid">
          
          {/* ЛІВА КОЛОНКА: Меню */}
          <aside className="layout-sidebar">
            <AsideMenu items={aboutSidebarMenu} />
          </aside>

          {/* ПРАВА КОЛОНКА: Контент з бази */}
          {/* Додаємо клас .content-body ТІЛЬКИ СЮДИ, щоб застилізувати HTML з бази */}
          <div className="layout-content content-body">
            
            {post ? (
              <>
                {/* ВСТАВКА HTML КОНТЕНТУ */}
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </>
            ) : (
              // Якщо завантаження пройшло, але запису немає в базі
              !isLoading && (
                <div>
                  <p>Інформація оновлюється...</p>
                </div>
              )
            )}

          </div>

        </div>
      </div>
    </Preloader>
  );
}