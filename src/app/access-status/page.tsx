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
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  const accessStatus = session?.user?.access_status;

  const statusConfig = {
    pending: {
      icon: Clock,
      title: 'Acceso Pendiente',
      description: 'Tu cuenta está siendo revisada',
      message:
        'Tu solicitud de acceso está pendiente de aprobación. Un administrador revisará tu cuenta pronto. Te notificaremos cuando tu acceso sea aprobado.',
      iconColor: 'text-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
    },
    blocked: {
      icon: XCircle,
      title: 'Acceso Bloqueado',
      description: 'Tu cuenta ha sido bloqueada',
      message:
        'Tu acceso a la plataforma ha sido bloqueado. Por favor, contacta con el administrador para obtener más información sobre el motivo y cómo proceder.',
      iconColor: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950',
    },
  };

  const config =
    statusConfig[accessStatus as keyof typeof statusConfig] ||
    statusConfig.pending;

  const Icon = config.icon;

  return (
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
          <Button onClick={handleLogout} variant="outline" className="w-full">
            Go to login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
