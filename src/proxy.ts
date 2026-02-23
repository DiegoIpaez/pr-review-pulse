import { NextRequest, NextResponse } from 'next/server';

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

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/', '/docs'],
};
