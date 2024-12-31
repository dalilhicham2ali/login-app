import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = cookies();
  
  // Supprimer le cookie de session
  cookieStore.delete('user');
  
  return NextResponse.json(
    { success: true },
    {
      status: 200,
      headers: {
        'Set-Cookie': `user=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
      }
    }
  );
}