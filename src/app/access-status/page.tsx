'use client';

import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle, Clock, XCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CanvasParticles from '@/components/common/canvas-particles';

export default function AccessStatusPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    if (session?.user?.access_status === 'active') {
      router.push('/');
    }
  }, [session, status, router]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  if (status === 'loading' || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const accessStatus = session?.user?.access_status;

  const statusConfig = {
    pending: {
      icon: Clock,
      title: 'Access Pending',
      description: 'Your account is being reviewed',
      message:
        'Your access request is pending approval. An administrator will review your account soon. We will notify you when your access is approved.',
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
    },
    blocked: {
      icon: XCircle,
      title: 'Access Blocked',
      description: 'Your account has been blocked',
      message:
        'Your access to the platform has been blocked. Please contact the administrator for more information about the reason and how to proceed.',
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950',
    },
  };

  const config =
    statusConfig[accessStatus as keyof typeof statusConfig] ||
    statusConfig.pending;

  const Icon = config.icon;

  return (
    <>
      <CanvasParticles />
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div
              className={`mx-auto mb-4 flex size-16 items-center justify-center rounded-full ${config.bgColor}`}
            >
              <Icon className={`size-8 ${config.iconColor}`} />
            </div>
            <CardTitle className="text-2xl">{config.title}</CardTitle>
            <CardDescription>{config.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-muted/50 p-4 text-sm text-muted-foreground">
              <AlertCircle className="mb-2 inline size-4" /> {config.message}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full cursor-pointer"
            >
              Go to login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
