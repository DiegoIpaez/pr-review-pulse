'use client';
import { redirect } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Spinner from '@/components/ui/custom/spinner';

export default function RedirectPage() {
  const { data: session, status } = useSession();

  if (status === 'loading')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size={50} />
      </div>
    );
  if (session?.user?.role === 'admin') redirect('/prs');
  else if (session?.user?.role === 'user') redirect('/prs/me');
  else redirect('/login');
}
