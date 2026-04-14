import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { CONFIG } from './constants';
import { hasAccessToRoute } from './middlewares/roles.middleware';
import { UserRole } from './generated/prisma/enums';

const corsOptions = {
  'Access-Control-Allow-Origin': CONFIG.BASE_URL,
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
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

  const isApi = pathname.startsWith('/api/');
  const session = await getToken({ req, secret: CONFIG.NEXT_AUTH.SECRET });
  const isLoggedIn = !!session;

  const isPublicRoute =
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/access-status' ||
    pathname === '/api/webhooks/github' ||
    pathname.startsWith('/api/auth');
  if (isPublicRoute)
    return NextResponse.next({ request: { headers: requestHeaders } });

  if (!isLoggedIn) {
    if (isApi)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

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

  const hasAccess = hasAccessToRoute(session.role as UserRole, pathname);
  if (!isApi && !hasAccess) {
    const notFound = new URL('/404', req.url);
    return NextResponse.redirect(notFound);
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/access-status',
    '/admin/:path*',
    '/collaborator/:path*',
    '/api/:path*',
  ],
};
