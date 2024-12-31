import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const userCookie = cookieStore.get('user');
    
    if (!userCookie) {
      return NextResponse.json({
        isAuthenticated: false,
        user: null
      });
    }

    const user = JSON.parse(userCookie.value);
    
    return NextResponse.json({
      isAuthenticated: true,
      user: user
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ 
      isAuthenticated: false, 
      user: null,
      error: 'Auth check error' 
    }, { 
      status: 200 
    });
  }
}