import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { CONFIG } from './constants';

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function proxy(req: NextRequest) {
  const contentType = req.headers.get('content-type');
  const requestHeaders = new Headers(req.headers);

  if (!contentType?.includes('multipart/form-data')) {
    Object.entries(corsOptions).forEach(([key, value]) => {
      requestHeaders.set(key, value);
    });
  }

  const { pathname } = req.nextUrl;
  const session = await getToken({ req, secret: CONFIG.NEXT_AUTH.SECRET });
  const isLoggedIn = !!session;

  const isPublicRoute =
    pathname === '/login' ||
    pathname === '/access-status' ||
    pathname.startsWith('/api/auth');
  if (isPublicRoute)
    return NextResponse.next({ request: { headers: requestHeaders } });

  if (!isLoggedIn) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }
  if (session?.access_status !== 'active') {
    const accessStatusUrl = new URL('/access-status', req.url);
    return NextResponse.redirect(accessStatusUrl);
  }
  if (session?.uid && session?.role && session?.access_status) {
    requestHeaders.set('uid', session?.uid.toString());
    requestHeaders.set('role', session?.role || '');
    requestHeaders.set('access_status', session?.access_status || '');
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/', '/login', '/access-status', '/users/:path*', '/api/:path*'],
};
