# Модуль WebSockets (`server/src/socket`)

Цей каталог містить логіку ініціалізації та обробки подій **WebSockets** на основі бібліотеки **Socket.io**. Модуль відокремлений від `src/index.ts` для дотримання чистоти архітектури.

---

## Файли та функції

| Файл | Функція | Призначення |
| :--- | :--- | :--- |
| [`index.ts`](/server/src/socket/index.ts) | `initSocket(httpServer)` | Створення та налаштування Socket.io сервера |

---

## Детальний опис `index.ts`

Функція `initSocket` приймає екземпляр `HttpServer` з модуля Node.js `http` та прив'язує до нього сокет-сервер:

```typescript
import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

export const initSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*", // Дозволяємо підключення з будь-якого фронтенду
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log('User connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};
```

---

## Налаштування та робота з сокетами:

1. **CORS Налаштування**:
   - `origin: "*"` дозволяє підключатися клієнтам Next.js / React з будь-якого домену та порту в режимі розробки.
   - `methods: ["GET", "POST"]` обмежує допустимі HTTP-методи для handshake-запитів.

2. **Обробка подій**:
   - **`connection`**: Спрацьовує при успішному підключенні нового WebSockets-клієнта, виводить у консоль його унікальний `socket.id`.
   - **`disconnect`**: Фіксує розрив з'єднання клієнтом та виводить ідентифікатор у консоль.

3. **Подальше розширення**:
   - Повернений екземпляр `io` дозволяє транслювати події в реальному часі (наприклад, сповіщення про нові книги, пости або чат підтримки читачів).
