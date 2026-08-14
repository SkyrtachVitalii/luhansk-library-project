import { fetchApi } from './config';
import { IUser } from '@/types';

export const usersApi = {
  /**
   * Створити нового користувача (для адміна)
   */
  createUser: (data: Record<string, unknown>) => {
    return fetchApi<{ user: IUser }>('/api/users', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(data),
    });
  },

  /**
   * Видалити користувача за ID
   */
  deleteUser: (id: string) => {
    return fetchApi<void>(`/api/users/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
  },
};

