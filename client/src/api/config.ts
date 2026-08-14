export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Обгортка навколо нативного fetch API, яка автоматично підставляє API_URL,
 * за замовчуванням обробляє JSON content-type та стандартизує викидання помилок.
 */
export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(options.headers || {});
  
  // За замовчуванням встановлюємо application/json, якщо є тіло запиту і не вказано content-type
  if (options.body && typeof options.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  // Тут можна налаштувати обробку помилок залежно від того, як бекенд їх повертає
  if (!res.ok) {
    let errorMessage = `API Error: ${res.status} ${res.statusText}`;
    try {
      const errorData = await res.json();
      if (errorData && errorData.message) {
        errorMessage = errorData.message;
      }
    } catch (e) {
      // Ігноруємо, якщо відповідь не є JSON
    }
    throw new Error(errorMessage);
  }

  // Обробка порожніх відповідей (наприклад, 204 No Content)
  if (res.status === 204) {
    return {} as T;
  }

  return res.json();
}
