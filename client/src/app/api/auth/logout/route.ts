import { NextResponse } from 'next/server';

export async function POST() {
  try {
    let backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    if (backendUrl.includes('localhost')) {
      backendUrl = backendUrl.replace('localhost', '127.0.0.1');
    }

    await fetch(`${backendUrl.replace(/\/$/, '')}/api/auth/logout`, {
      method: 'POST',
    }).catch(() => {});

    const response = NextResponse.json({ message: 'Logged out successfully' });
    response.cookies.delete('token');
    return response;
  } catch (error) {
    const response = NextResponse.json({ message: 'Logged out' });
    response.cookies.delete('token');
    return response;
  }
}
