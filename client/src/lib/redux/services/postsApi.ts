// client/src/lib/redux/services/postsApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IPost } from '@/types'; // <--- Дивись, який красивий імпорт!

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/api/' 
  }),
  endpoints: (builder) => ({
    getPosts: builder.query<IPost[], void>({
      query: () => 'posts',
    }),
  }),
});

export const { useGetPostsQuery } = postsApi;