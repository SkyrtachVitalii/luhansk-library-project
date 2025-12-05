import { io } from 'socket.io-client';

// URL бекенду (поки локальний, потім буде Render)
const URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const socket = io(URL, {
  autoConnect: false, // Ми будемо підключати вручну, коли користувач зайде на сайт
});