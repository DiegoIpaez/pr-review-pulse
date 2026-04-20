'use client';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import CanvasParticles from '@/components/common/canvas-particles';
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
    <>
      <CanvasParticles />
      <div className="min-h-screen flex items-center justify-center ">
        <div className="flex flex-col items-center justify-center text-center min-h-[50vh] space-y-2">
          <h1 className="text-3xl font-bold">Page Not Found</h1>
          <p className="text-muted-foreground">
            Oops! The page you are looking for could not be found.
          </p>
          <Link href={backUrl}>
            <Button
              disabled={status === 'loading'}
              isLoading={status === 'loading'}
              className="mt-4 shadow-md font-semibold text-sm cursor-pointer"
            >
              {status === 'loading' ? 'Loading...' : backText}
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
