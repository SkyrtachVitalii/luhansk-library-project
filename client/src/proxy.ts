import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

interface JwtPayload {
  userId?: string;
  role?: string;
  exp?: number;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Отримуємо токен з куки 'token'
  const token = request.cookies.get('token')?.value;

  if (!token) {
    // Якщо токен відсутній, перенаправляємо на головну сторінку
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key';
    const secretKey = new TextEncoder().encode(jwtSecret);

    const { payload } = await jwtVerify<JwtPayload>(token, secretKey);

    const userRole = payload.role;

    // Звичайний користувач (читач) не має доступу до адміністративної панелі
    if (userRole === 'user') {
      return NextResponse.redirect(new URL('/e-catalog', request.url));
    }

    // Менеджери (бібліотекарі) не мають доступу до керування користувачами (/admin/all-users)
    if (userRole === 'manager' && pathname.startsWith('/admin/all-users')) {
      return NextResponse.redirect(new URL('/admin/all-posts', request.url));
    }

    // Додаємо збагачені заголовки в запит для внутрішнього використання у Server Components
    const requestHeaders = new Headers(request.headers);
    if (payload.userId) requestHeaders.set('x-user-id', String(payload.userId));
    if (payload.role) requestHeaders.set('x-user-role', String(payload.role));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    console.error('Proxy JWT verification failed:', error);

    // У разі зіпсованого або простроченого токена видаляємо cookie та перенаправляємо на головну
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
