"use client";

import { useGetPostsQuery } from '@/lib/redux/services/postsApi';
import Preloader from '@/components/Preloader/Preloader';
import AsideMenu from '@/components/AsideMenu/AsideMenu';
import { aboutSidebarMenu } from '@/config/menus'; // Використовуємо меню "Про бібліотеку"
import SafeHTML from '@/components/SafeHTML/SafeHTML'; // Використовуємо SafeHTML, якщо там є старі акордеони


export default function TrainingCenterPage() {
    
  // 1. Запит до API
  const { data, isLoading, error } = useGetPostsQuery({
    category: 'contacts', // <--- Категорія з вашого запиту
    lang: 'uk',
    limit: 1,
  });

  // 2. Отримуємо перший знайдений пост
  const post = data?.data?.[0];

  if (error) {
    return <div className="container py-10 text-center text-red-500">Помилка завантаження даних.</div>;
  }

  return (
    <Preloader isLoading={isLoading} type="local">
      <div className="container py-10">
        
        {/* Використовуємо глобальну сітку */}
        <div className="layout-grid">
          
          {/* ЛІВА КОЛОНКА: Меню */}
          <aside className="layout-sidebar">
            <AsideMenu items={aboutSidebarMenu} />
          </aside>

          {/* ПРАВА КОЛОНКА: Контент */}
          {/* Клас content-body автоматично стилізує заголовки, списки та приховає старі col-lg-3 */}
          <div className="layout-content content-body">
            
            {post ? (
              <>
                <SafeHTML html={post.content} />
              </>
            ) : (
              // Стан, коли завантаження завершилось, але запису в базі немає
              !isLoading && (
                <div className="py-10 text-center text-gray-500">
                  <h2>Сторінка оновлюється</h2>
                  <p>Інформація про контакти скоро з&apos;явиться.</p>
                </div>
              )
            )}

          </div>

        </div>
      </div>
    </Preloader>
  );
}