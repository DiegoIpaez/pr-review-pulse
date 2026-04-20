'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Button from '@/components/ui/custom/button';
import clientErrorHandler from '@/utils/handlers/client-error.handler';
import { GithubIcon } from './icons';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn('github', { callbackUrl: '/' });
    } catch (error) {
      clientErrorHandler({
        error,
        title: 'Login failed',
        description: 'An error occurred during login. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleLogin}
        className="w-full text-muted-foreground cursor-pointer py-2"
        size="lg"
        variant="outline"
        disabled={isLoading}
        isLoading={isLoading}
      >
        <GithubIcon />
        Continue with GitHub
      </Button>
    </div>
  );
}
