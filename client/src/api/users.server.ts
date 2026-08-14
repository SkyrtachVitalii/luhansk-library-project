import { fetchApi } from './config';

export const usersServerApi = {
  /**
   * Отримати всіх користувачів (для Server Components)
   */
  getAllUsers: (token: string) => {
    return fetchApi<Record<string, unknown>[]>('/api/users', {
      headers: { Cookie: `token=${token}` },
      cache: 'no-store'
    });
  },
};
