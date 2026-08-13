# Модуль контролерів (`server/src/controllers`)

Цей каталог містить **обробники HTTP-запитів (Controllers)**. Контролери приймають вхідні дані з об'єктів Express `Request`, викликають відповідну бізнес-логіку або Mongoose-моделі та повертають відповіді `Response` (JSON або вказівки для куків).

---

## Перелік контролерів

| Файл | Оброблювані функції | Призначення |
| :--- | :--- | :--- |
| [`auth.controller.ts`](/server/src/controllers/auth.controller.ts) | `register`, `login`, `logout`, `getMe` | Реєстрація, автентифікація, вихід та перевірка поточного сеансу |
| [`post.controller.ts`](/server/src/controllers/post.controller.ts) | `createPost`, `getAllPosts`, `getOneOldPost` | Створення, вибірка з пагінацією та пошук постів за архівним ID |
| [`user.controller.ts`](/server/src/controllers/user.controller.ts) | `getAllUsers`, `deleteUser` | Адміністрування списку користувачів та видалення профілю |

---

## 1. `auth.controller.ts`

Обробка операцій з автентифікацією користувачів:

- **`register(req, res)`**:
  - Приймає дані користувача у `req.body`.
  - Викликає `AuthService.register(req.body)`.
  - Видаляє `passwordHash` з об'єкта відповіді перед відправкою.
  - Повертає статус `201 Created` з даними зареєстрованого користувача або `400 Bad Request` при помилці.

- **`login(req, res)`**:
  - Приймає `email` та `password` з `req.body`.
  - Викликає `AuthService.login(email, password)`, отримує `user` та `token`.
  - Встановлює `httpOnly` куки з назвою `token` на 7 днів (`sameSite: 'lax'`, `secure: true` у продакшні).
  - Повертає статус `200 OK` з об'єктом користувача (без `passwordHash`) або `401 Unauthorized` при невірному логіні/паролі.

- **`logout(req, res)`**:
  - Викликає `res.clearCookie('token')`.
  - Повертає статус `200 OK` з повідомленням про успішний вихід.

- **`getMe(req, res)`**:
  - Зчитує `req.user.userId` (встановлений через `optionalAuthMiddleware`).
  - Якщо користувач не авторизований або не знайдений у БД, повертає `{ user: null, isAuthenticated: false }`.
  - Якщо користувач знайдений, повертає `{ user, isAuthenticated: true }` (без `passwordHash`).

---

## 2. `post.controller.ts`

Управління публікаціями та архівними статтями:

- **`createPost(req, res)`**:
  - Створює новий екземпляр `Post` на основі `title`, `content`, `category`, `author`, `tags`.
  - Зберігає у БД та повертає статус `201 Created` з відформатованим постом.

- **`getAllPosts(req, res)`**:
  - Зчитує query-параметри: `page` (за замовчуванням 1), `limit` (за замовчуванням 7), `category`, `lang`.
  - Фільтрує за `category` (якщо вказана) та мовою `originalData.lang` (якщо вказана).
  - Повертає об'єкт з пагінацією:
    ```json
    {
      "data": [...],
      "currentPage": 1,
      "numberOfPages": 10,
      "totalPosts": 70
    }
    ```

- **`getOneOldPost(req, res)`**:
  - Приймає числовий архівний ID з `req.params.id`.
  - Виконує пошук через `Post.findOne({ oldId: searchId })`.
  - Повертає пост у форматі JSON або `404 Not Found` (якщо пост відсутній).

---

## 3. `user.controller.ts`

Адміністративні функції управління користувачами:

- **`getAllUsers(req, res)`**:
  - Виконує вибірку всіх користувачів `User.find({}).sort({ createdAt: -1 })`.
  - Повертає масив користувачів у форматі JSON.

- **`deleteUser(req, res)`**:
  - Зчитує `id` з `req.params.id`.
  - Виконує видалення через `User.findByIdAndDelete(id)`.
  - Повертає `200 OK` при успіху або `404 Not Found`, якщо користувача з таким ID не існує.
