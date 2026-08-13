# TypeScript Interfaces & Types (`client/src/types`)

Папка містить централізовані оголошення інтерфейсів та типів TypeScript для всього клієнтського додатку.

---

## 📋 Огляд модулів типізації

| Файл | Опис типів |
| :--- | :--- |
| **`post.types.ts`** | **`IPost`**: Модель статті/новини (включає `_id`, `title`, `content`, `oldId`, `lang`, `categories`, `createdDate`, `sections`, `media`).<br>**`IPostSection`**, **`IPostMedia`**: Вкладені секції та медіафайли Cloudinary. |
| **`user.types.ts`** | **`IUser`**: Повна модель користувача системи.<br>**`tableUserData`**: Полегшений інтерфейс для відображення в таблиці адмін-панелі.<br>**`SessionPayload`**: Об'єкт поточного авторизованого користувача.<br>**`UserRole`**: Ролі користувачів (`"user" \| "manager" \| "admin"`). |
| **`layout.types.ts`** | Типи пропсів для макетів та компонентів навігації. |
| **`theme.types.ts`** | Типи для перемикання теми оформлення (`"light" \| "dark"`). |
| **`preloader.types.ts`** | Стейт та пропси анімованого прелоадера. |
| **`index.ts`** | Головна точка експорту найуживаніших інтерфейсів (`export * from './post.types'`, `export * from './user.types'`). |
