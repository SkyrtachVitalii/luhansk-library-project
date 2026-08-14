import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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
