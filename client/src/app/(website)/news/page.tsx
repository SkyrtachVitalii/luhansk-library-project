import PostList from '@/components/PostList/PostList';
import Pagination from '@/components/Pagination/Pagination';
import styles from './NewsPage.module.scss';
import Sidebar from '@/components/Sidebar/Sidebar';
import { PostsResponse } from '@/types';
import { Metadata } from 'next';
import { postsServerApi } from '@/api/posts.server';

export const metadata: Metadata = {
  title: 'Новини Бібліотеки',
  description: 'Останні новини та події нашої бібліотеки',
};


interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function NewsPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const pageParam = searchParams?.page;
  const currentPage = pageParam ? parseInt(pageParam as string, 10) : 1;

  let data: PostsResponse | null = null;
  let error = false;

  try {
    data = await postsServerApi.getNews(currentPage);
  } catch (e) {
    console.error('Error fetching news:', e);
    error = true;
  }

  if (error) return <div className="container py-10 text-center text-red-500">Помилка завантаження новин.</div>;

  const posts = data?.data || [];
  const totalPages = data?.numberOfPages || 0;

  return (
    <div className={`container ${styles.pageContainer}`}>
      <div className={styles.layoutGrid}>
        
        <div className={styles.contentColumn}>
          <PostList posts={posts} />

          {posts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              baseUrl="/news"
            />
          )}

          {posts.length === 0 && (
            <p className="text-center py-10">Новин поки немає.</p>
          )}
        </div>

        <aside className={styles.sidebarColumn}>
          <div className={styles.stickyWidget}>
            <Sidebar />
          </div>
        </aside>

      </div>
    </div>
  );
}