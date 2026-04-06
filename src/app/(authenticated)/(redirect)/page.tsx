'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Spinner from '@/components/ui/custom/spinner';
import CanvasParticles from '@/components/common/canvas-particles';

export default function RedirectPage() {
  const { data: session, status } = useSession();

  if (status === 'loading')
    return (
      <>
        <CanvasParticles />
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size={50} />
        </div>
      </>
    );
  if (session?.user?.role === 'admin') redirect('/admin');
  else if (session?.user?.role === 'user') redirect('/collaborator');
  else redirect('/login');
}
