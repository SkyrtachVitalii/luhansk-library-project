# Core Library & State Management (`client/src/lib`)

Папка `lib` містить ядро стейт-менеджменту (Redux Toolkit), послуги взаємодії з бекенд REST API та підключення до веб-сокетів.

---

## 📦 Redux Toolkit (`client/src/lib/redux`)

Управління станом додатку побудовано на **Redux Toolkit v2**:

### 1. Store та Провайдер
- **`store.ts`** — Конфігурація Redux store. Об'єднує редюсери та middleware RTK Query (`postsApi`).
- **`StoreProvider.tsx`** — Client Component провайдер (`<Provider store={store}>`), що обгортає додаток у `layout.tsx`.

### 2. RTK Query — `services/postsApi.ts`
Відповідає за асинхронне завантаження постів та новин з Express API:
```typescript
baseUrl: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/`
```
- **`useGetPostsQuery`** — Хук для отримання списку постів із підтримкою пагінації (`page`), мови (`lang`), категорії (`category`) та унікальних тегів для інвалідації кешу (`tagTypes: ['Posts']`).

### 3. Redux Slice — `slices/postsSlice.ts`
- Зберігає локальний стан вибраної категорії, поточної сторінки або фільтрів.

---

## 🌐 HTTP API Client (`client/src/lib/api.ts`)

Модуль для використання у **Server Components** Next.js (з підтримкою кешування `fetch`):

- **`getPost(oldId: string)`**:
  Виконує запит `${apiUrl}/api/posts/old/${oldId}` з автоматичним revalidate (60 сек) для SSG/ISR рендерингу сторінки статті.
- **`getSession()`**:
  Зчитує токен з HTTP-only кукі за допомогою `next/headers` і робить запит на бекенд `${apiUrl}/api/auth/me` для отримання інформації про поточного авторизованого користувача.

---

## 🔌 WebSockets (`client/src/lib/socket.ts`)

Налаштування **Socket.io** клієнта для зв'язку в реальному часі:
```typescript
import { io } from 'socket.io-client';

const URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const socket = io(URL, {
  autoConnect: false, // Підключення викликається вручну у потрібному місці
});
```
Забезпечує синхронізацію нових сповіщень та подій між сервером та клієнтом.
