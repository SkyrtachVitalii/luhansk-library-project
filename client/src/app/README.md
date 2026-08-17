# App Router Structure (`client/src/app`)

Ця папка містить структуру маршрутів та сторінок веб-додатку на базі **Next.js App Router**.

---

## 🗺 Структура маршрутизації

### 1. Публічна частина — Route Group `(website)`
Усі сторінки публічного веб-сайту об'єднані в групу `(website)`, що дозволяє використовувати єдиний `layout.tsx` (з Header, Footer, Sidebar, Preloader):
- `/` — Головна сторінка з carousel та останніми публікаціями.
- `/news` — Новини бібліотеки.
- `/article/[slug]` — Динамічний перегляд конкретної статті або архівного поста.
- `/about`, `/history`, `/contacts` — Інформаційні сторінки.
- `/laws`, `/methods`, `/projects`, `/publications`, `/recommends`, `/reports`, `/services`, `/trains`, `/lula`, `/luglibs`, `/analitics`, `/nonstopleaning`, `/profcas` — Тематичні розділи бібліотечної діяльності.

### 2. Адмін-панель — Маршрут `admin`
Панель керування вмістом та користувачами системи (доступ лише авторизованим користувачам з ролями `admin` або `manager`):
- `/admin` — Головна сторінка адмін-панелі.
- `/admin/all-users` — Таблиця керування користувачами (доступна тільки ролі `admin`).

### 3. Авторизація та Реєстрація
- `/register` — Сторінка реєстрації нових користувачів.
- Модальні вікна входу (`LoginModal`) інтегровані в загальний `Header`.

---

## 🔒 Перевірка сесії (Authentication)

Серверні компоненти (Server Components) отримують інформацію про поточного користувача через утиліту `getSession()` з `@/lib/api`:
```typescript
import { getSession } from "@/lib/api";

const session = await getSession();
// Отримуємо об'єкт { id, email, role, firstName, lastName } або null
```
Запит передає HTTP-only куку `token` на Express-бекенд (`/api/auth/me`), забезпечуючи безпеку сесії без зберігання токенів у `localStorage`.

---

## 🎨 Стилі та Макети
- **`globals.scss`** — Глобальні стилі, нормалізація CSS, підсистема CSS-змінних для світлої (`:root`) та темної (`.dark`) тем, адаптивна сітка (`.layout-grid`), захист від переповнення контенту (`.content-body` з горизонтальним скролом для `table`/`iframe` та `overflow-wrap: break-word`) та шрифт Inter/Roboto/Tahoma.
- **`layout.tsx`** — Кореневий макет, що підключає Redux `StoreProvider` та `ThemeProvider`.
- **`loading.tsx` & `not-found.tsx`** — Стандартні інтерфейси завантаження та сторінки 404.
