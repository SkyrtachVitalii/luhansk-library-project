// client/src/lib/redux/services/postsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PostsResponse, PostsArgs } from '@/types';

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/` 
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