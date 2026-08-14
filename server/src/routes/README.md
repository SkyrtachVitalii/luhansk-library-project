# Модуль маршрутизації API (`server/src/routes`)

Цей каталог містить **маршрутизатори Express (Routers)**. Вони пов'язують HTTP-методи та URI-шляхи з відповідними мідлварами та функціями контролерів.

---

## Зведена таблиця API-ендпоінтів

Усі маршрути реєструються у головному Express-додатку ([`app.ts`](/server/src/app.ts)) з відповідними префіксами.

### 1. Ендпоінти автентифікації (`/api/auth`)
*Файл:* [`auth.routes.ts`](/server/src/routes/auth.routes.ts)

| Метод | Шлях | Мідлвари | Контролер | Опис |
| :---: | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | — | `register` | Реєстрація нового користувача |
| `POST` | `/api/auth/login` | — | `login` | Вхід у систему та отримання `httpOnly` cookie |
| `POST` | `/api/auth/logout` | — | `logout` | Вихід із системи (очищення cookie) |
| `GET` | `/api/auth/me` | `optionalAuthMiddleware` | `getMe` | Отримання даних поточного авторизованого користувача |

---

### 2. Ендпоінти публікацій (`/api/posts`)
*Файл:* [`post.routes.ts`](/server/src/routes/post.routes.ts)

| Метод | Шлях | Параметри Query / Params | Контролер | Опис |
| :---: | :--- | :--- | :--- | :--- |
| `GET` | `/api/posts/` | `?page=1&limit=7&category=news&lang=uk` | `getAllPosts` | Отримання списку постів із пагінацією та фільтрацією |
| `GET` | `/api/posts/old/:id` | `:id` (числовий архівний ID) | `getOneOldPost` | Отримання публікації за її старим архівним ID |
| `POST` | `/api/posts/` | Body: JSON поста | `createPost` | Створення нової публікації |

---

### 3. Ендпоінти користувачів (`/api/users`)
*Файл:* [`user.routes.ts`](/server/src/routes/user.routes.ts)

| Метод | Шлях | Мідлвари (Захист) | Контролер | Опис |
| :---: | :--- | :--- | :--- | :--- |
| `GET` | `/api/users/` | `authMiddleware` | `getAllUsers` | Отримання списку всіх користувачів (для автентифікованих) |
| `POST` | `/api/users/` | `authMiddleware`, `requireAdmin` | `createUser` | Створення нового користувача адміністратором (**тільки для admin**) |
| `DELETE` | `/api/users/:id` | `authMiddleware`, `requireAdmin` | `deleteUser` | Видалення користувача за ID (**тільки для admin**) |

---

### 4. Системні ендпоінти
*Файл:* [`app.ts`](/server/src/app.ts)

| Метод | Шлях | Мідлвари | Відповідь | Опис |
| :---: | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | — | `{ status: 'ok', message: 'Server is running' }` | Перевірка працездатності сервера |
