import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PostsResponse, PostsArgs } from '@/types';
import { API_URL } from '@/api/config';

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${API_URL}/api/` 
  }),
  tagTypes: ['Posts'], // Корисно для кешування (щоб оновлювати дані при додаванні поста)
  endpoints: (builder) => ({
    // <Що повертає, Що приймає>
    getPosts: builder.query<PostsResponse, PostsArgs | void>({
      query: (args) => {
        // Якщо аргументів немає (void), використовуємо порожній об'єкт
        const { page = 1, limit = 7, category, lang, oldId } = args || {};

        return {
          url: 'posts',
          // RTK Query сам зробить з цього ?page=1&limit=7&category=news
          params: {
            page,
            limit,
            category,
            lang, // <--- Передаємо параметр на сервер
            oldId,
          },
        };
      },
      providesTags: ['Posts'],
    }),
  }),
});

export const { useGetPostsQuery } = postsApi;