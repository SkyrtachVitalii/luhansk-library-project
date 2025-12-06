// client/src/lib/redux/services/postsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IPost } from '@/types';

// 1. Описуємо структуру відповіді від сервера (те, що ми зробили в контролері)
export interface PostsResponse {
  data: IPost[];           // Сам масив постів тепер тут
  currentPage: number;
  numberOfPages: number;
  totalPosts: number;
}

// 2. Описуємо, які параметри ми можемо передати в хук
export interface GetPostsArgs {
  page?: number;
  limit?: number;
  category?: string;
  lang?: string; // <--- Додали нове поле
}

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api/' 
  }),
  tagTypes: ['Posts'], // Корисно для кешування (щоб оновлювати дані при додаванні поста)
  endpoints: (builder) => ({
    // <Що повертає, Що приймає>
    getPosts: builder.query<PostsResponse, GetPostsArgs | void>({
      query: (args) => {
        // Якщо аргументів немає (void), використовуємо порожній об'єкт
        const { page = 1, limit = 7, category, lang } = args || {};

        return {
          url: 'posts',
          // RTK Query сам зробить з цього ?page=1&limit=7&category=news
          params: {
            page,
            limit,
            category,
            lang, // <--- Передаємо параметр на сервер
          },
        };
      },
      providesTags: ['Posts'],
    }),
  }),
});

export const { useGetPostsQuery } = postsApi;