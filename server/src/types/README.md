# Модуль визначення типів (`server/src/types`)

Цей каталог містить **TypeScript-інтерфейси** та **типи**, які описують структуру даних всього сервера. Вони розширюють базовий тип Mongoose `Document` для забезпечення суворої типізації при роботі з MongoDB, контролерами та сервісами.

---

## Файли та типи

| Файл | Визначені інтерфейси / типи | Опис |
| :--- | :--- | :--- |
| [`post.interface.ts`](/server/src/types/post.interface.ts) | `IPost` | Інтерфейс публікації / допису |
| [`user.interface.ts`](/server/src/types/user.interface.ts) | `IUser`, `UserRole` | Інтерфейс користувача та юніон ролей |

---

## 1. Інтерфейс `IPost` (`post.interface.ts`)

Розширює `Document` з Mongoose і визначає типи для роботи з публікаціями у коді TypeScript.

```typescript
import { Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  shortDescription: string;
  content: string;
  imageUrl: string;
  category: string;
  viewsCount: number;
  tags: string[];
  author: string;
  
  // Нові поля для збереження історії
  oldId: number;           // Старий ID з MySQL
  seoKeywords: string;     // Ключові слова SEO
  seoDescription: string;  // Мета-опис SEO
  originalData: any;       // Сирий JSON-об'єкт зі старого сайту
  
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 2. Інтерфейси та типи користувачів (`user.interface.ts`)

### Тип `UserRole`
Визначає перелік допустимих ролей у системі для контролю доступу (RBAC):
```typescript
export type UserRole = 'user' | 'manager' | 'admin';
```

### Інтерфейс `IUser`
Розширює `Document` з Mongoose та описує повний профіль користувача:
```typescript
import { Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  patronymic?: string;
  email: string;
  phone: string;
  passwordHash: string;
  dateOfBirth: Date;
  gender: 'Male' | 'Female';
  address: string;
  education?: string;
  activitiField?: string;
  workplace?: string;
  addictionalInfo?: string;
  gdprConsent: boolean;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
```
