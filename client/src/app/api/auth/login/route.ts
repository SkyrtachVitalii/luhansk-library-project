import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    // Fix Node 18+ localhost resolution issue
    if (backendUrl.includes('localhost')) {
      backendUrl = backendUrl.replace('localhost', '127.0.0.1');
    }
    const body = await request.json();

    const res = await fetch(`${backendUrl.replace(/\/$/, '')}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    const response = NextResponse.json(data);

    if (data.token) {
      const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL;
      response.cookies.set('token', data.token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 7 днів
      });
    }

    return response;
  } catch (error) {
    console.error('Next.js auth/login route error:', error);
    return NextResponse.json(
      { message: 'Помилка з\'єднання з сервером авторизації' },
      { status: 500 }
    );
  }
}
