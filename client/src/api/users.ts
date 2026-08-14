import { fetchApi } from './config';

export const usersApi = {
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
