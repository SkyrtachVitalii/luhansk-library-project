// client/src/lib/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './slices/postsSlice';
import { postsApi } from './services/postsApi'; // <--- 1. Імпорт вашого API

export const store = configureStore({
  reducer: {
    // Ваші звичайні слайси
    posts: postsReducer,
    
    // 2. Обов'язково додаємо редюсер API сюди
    [postsApi.reducerPath]: postsApi.reducer,
  },
  
  // 3. ОСЬ ЦЕЙ БЛОК ВИПРАВЛЯЄ ВАШУ ПОМИЛКУ
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(postsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;