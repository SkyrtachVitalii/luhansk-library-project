"use client";

import React from 'react';
import { useGetPostsQuery } from '@/lib/redux/services/postsApi';
import Preloader from '@/components/Preloader/Preloader';
import AsideMenu from '@/components/AsideMenu/AsideMenu';
import SafeHTML from '@/components/SafeHTML/SafeHTML';
import { aboutSidebarMenu } from '@/config/menus';

export default function AboutPage() {
  const { data, isLoading, error } = useGetPostsQuery({
    category: 'partners', // <--- ЗМІНИЛИ КАТЕГОРІЮ
    lang: 'uk',
    limit: 1,
  });

  const post = data?.data?.[0];

  if (error) return <div className="container py-10 text-red-500">Помилка.</div>;

  return (
    <Preloader isLoading={isLoading} type="local">
      <div className="container py-10">
        <div className="layout-grid">
          
          <AsideMenu items={aboutSidebarMenu} />

          <div className="layout-content content-body">
            {post ? (
              <SafeHTML html={post.content} />
            ) : (
              !isLoading && <p>Інформація про бібліотеку готується до публікації.</p>
            )}
          </div>

        </div>
      </div>
    </Preloader>
  );
}