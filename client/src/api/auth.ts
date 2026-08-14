import { fetchApi } from './config';
import { IUser } from '@/types';

interface LoginData {
  email: string;
  password: string;
}

export const authApi = {
  /**
   * Увійти в систему
   */
  login: (data: LoginData) => {
    return fetchApi<{ user: IUser; token?: string }>('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(data),
    });
  },

  /**
   * Вийти з системи
   */
  logout: () => {
    return fetchApi<void>('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  },

  /**
   * Перевірити поточного користувача (клієнтський запит)
   */
  me: () => {
    return fetchApi<{ user: IUser }>('/api/auth/me', {
      credentials: 'include',
    });
  },

  /**
   * Реєстрація (створення нового користувача)
   */
  register: (data: Record<string, unknown>) => {
    return fetchApi<{ user: IUser }>('/api/auth/register', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(data),
    });
  }
};
