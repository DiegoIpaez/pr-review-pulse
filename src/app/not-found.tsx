'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Button from '@/components/ui/custom/button';

export default function NotFoundPage() {
  const { data: session, status } = useSession();

  const backUrl = session?.user
    ? session?.user.role === 'admin'
      ? '/admin'
      : '/'
    : '/login';

  const backText = session?.user ? 'Back to home' : 'Back to Login';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
      <div className="flex flex-col items-center justify-center text-center min-h-[50vh]">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="mt-4 text-lg text-gray-400">
          Oops! The page you are looking <br /> for could not be found.
        </p>
        <Link href={backUrl}>
          <Button
            disabled={status === 'loading'}
            isLoading={status === 'loading'}
            className="mt-6  p-6 shadow-md font-semibold text-lg cursor-pointer text-gray-800"
          >
            {status === 'loading' ? 'Loading...' : backText}
          </Button>
        </Link>
      </div>
    </div>
  );
}
