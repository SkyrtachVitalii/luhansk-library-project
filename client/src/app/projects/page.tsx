"use client";

import SafeHTML from '@/components/SafeHTML/SafeHTML';
import { useGetPostsQuery } from '@/lib/redux/services/postsApi';
import Preloader from '@/components/Preloader/Preloader';
import AsideMenu from '@/components/AsideMenu/AsideMenu';
import { projectsMenuItems } from '@/config/menus';

export default function Projects() {
  const { data, isLoading, error } = useGetPostsQuery({
    category: 'projects', // <--- ЗМІНИЛИ КАТЕГОРІЮ
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
            <AsideMenu items={projectsMenuItems} />
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