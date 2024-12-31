import { NextResponse } from 'next/server';

// Remove middleware completely since we're handling auth in route handlers
export const config = {
  matcher: [] // Empty matcher since we're not using middleware
};

export function middleware(request) {
  return NextResponse.next();
}