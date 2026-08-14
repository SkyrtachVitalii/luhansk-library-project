import { PostsResponse, IPost } from '@/types';
import { API_URL } from './config';

export const postsServerApi = {
  /**
   * Отримати список новин з пагінацією
   */
  getNews: async (page: number): Promise<PostsResponse> => {
    const res = await fetch(`${API_URL}/api/posts?page=${page}&limit=20&category=news`, {
      next: { revalidate: 300 }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch news');
    }

    return res.json();
  },

  /**
   * Отримати конкретний пост за старим ID
   */
  getPost: async (oldId: string): Promise<IPost | null> => {
    try {
      const res = await fetch(`${API_URL}/api/posts/old/${oldId}`, {
        next: { revalidate: 60 } 
      });

      if (!res.ok) return null;
      return res.json();
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  }
};
