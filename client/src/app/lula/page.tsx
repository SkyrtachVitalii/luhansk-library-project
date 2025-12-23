"use client";

import SafeHTML from '@/components/SafeHTML/SafeHTML';
import { useGetPostsQuery } from '@/lib/redux/services/postsApi';
import Preloader from '@/components/Preloader/Preloader';
import AsideMenu from '@/components/AsideMenu/AsideMenu';
import { lulaSidebarMenu } from '@/config/menus';

export default function AboutPage() {
  const { data, isLoading, error } = useGetPostsQuery({
    category: 'lula', // <--- ЗМІНИЛИ КАТЕГОРІЮ
    lang: 'uk',
    limit: 1,
  });

  const post = data?.data?.[0];

  if (error) return <div className="container py-10 text-red-500">Помилка.</div>;

  return (
    <Preloader isLoading={isLoading} type="local">
      <div className="container py-10">
        <div className="layout-grid">
          
          <aside className="layout-sidebar">
            <AsideMenu items={lulaSidebarMenu} />
          </aside>

          <div className="layout-content content-body">
            {post ? (
              <>
                <SafeHTML html={post.content} />
              </>
            ) : (
              !isLoading && <p>Інформація про бібліотеку готується до публікації.</p>
            )}
          </div>

        </div>
      </div>
    </Preloader>
  );
}