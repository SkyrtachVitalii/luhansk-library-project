# Модуль промежуточних обробників / Middleware (`server/src/middleware`)

Цей каталог містить **Express Middleware (мідлвари)**, які перехоплюють HTTP-запити до їх надходження у контролери. Вони відповідають за перевірку сесій, автентифікацію, авторизацію та контроль доступу на основі ролей (RBAC).

---

## Файли та функції

| Файл | Назва Middleware | Призначення |
| :--- | :--- | :--- |
| [`auth.middleware.ts`](/server/src/middleware/auth.middleware.ts) | `authMiddleware` | Обов'язкова перевірка JWT-токена у куках |
| [`auth.middleware.ts`](/server/src/middleware/auth.middleware.ts) | `optionalAuthMiddleware` | Опціональна перевірка токена для публічних маршрутів |
| [`auth.middleware.ts`](/server/src/middleware/auth.middleware.ts) | `requireAdmin` | Обмеження доступу лише для користувачів із роллю `admin` |

---

## Детальний опис функцій

### 1. `authMiddleware`
Обов'язковий перехоплювач для захищених ендпоінтів.
- **Алгоритм роботи**:
  1. Перевіряє наявність токена у `req.cookies.token`.
  2. Якщо токен відсутній — негайно повертає відповідь зі статусом `401 Unauthorized` (`{ error: 'Authentication required' }`).
  3. Якщо токен є, розшифровує його через `AuthService.verifyToken(token)`.
  4. Прикріплює розшифровані дані користувача до об'єкта запиту: `(req as any).user = decoded`.
  5. Передає управління далі через `next()`.
  6. У разі простроченого чи невалідного токена повертає `401 Unauthorized` (`{ error: 'Invalid or expired token' }`).

### 2. `optionalAuthMiddleware`
М'яка автентифікація для публічних маршрутів (наприклад, `/api/auth/me` або перегляд публічних постів).
- **Алгоритм роботи**:
  1. Зчитує токен із `req.cookies?.token`.
  2. Якщо токен присутній, намагається його декодувати та зберегти у `(req as any).user`.
  3. Якщо токен відсутній або виникає помилка декодування (прострочений/пошкоджений) — **не блокує запит**, а просто пропускає його далі через `next()`.
  4. Дозволяє ендпоінту повернути публічний вміст або вказати `isAuthenticated: false`.

### 3. `requireAdmin`
Контроль доступу на основі ролей (RBAC) для адміністративних дій.
- **Алгоритм роботи**:
  1. Зчитує `(req as any).user?.role`.
  2. Перевіряє, чи дорівнює роль значення `admin`.
  3. Якщо роль НЕ `admin` (або `user` не задано) — повертає `403 Forbidden` (`{ error: 'Forbidden: admin access required' }`).
  4. Якщо користувач є адміністратором — передає управління у контролер через `next()`.
  
> [!IMPORTANT]
> `requireAdmin` обов'язково повинен підключатися **після** `authMiddleware` у ланцюжку роутера (наприклад: `router.delete('/:id', authMiddleware, requireAdmin, deleteUser)`).
