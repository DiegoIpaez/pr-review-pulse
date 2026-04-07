'use client';

import { useState } from 'react';
import Button from '@/components/ui/custom/button';
import CanvasParticles from '@/components/common/canvas-particles';

type ErrorBoundaryProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorBoundaryProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <CanvasParticles />
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-3xl font-bold">An unexpected error occurred</h1>
        <p className="mt-2 text-muted-foreground max-w-md">
          We apologize for the inconvenience. Our team has been notified and we
          are working to resolve it.
        </p>
        <div className="flex gap-4 mt-6">
          <Button
            className="shadow-md hover:shadow-lg transition-all duration-200"
            onClick={reset}
          >
            Try again
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowDetails((prev) => !prev)}
          >
            {showDetails ? 'Hide details' : 'Show details'}
          </Button>
        </div>
        {showDetails && (
          <div className="mt-6 w-full max-w-2xl max-h-[40vh] overflow-y-scroll bg-muted text-left rounded-lg p-4 overflow-auto border">
            <p className="font-semibold text-foreground">Message:</p>
            <pre className="whitespace-pre-wrap break-words text-sm text-destructive">
              {error?.message}
            </pre>
            {error?.stack && (
              <>
                <p className="mt-4 font-semibold text-foreground">
                  Stack trace:
                </p>
                <pre className="whitespace-pre-wrap break-words text-xs text-muted-foreground">
                  {error?.stack}
                </pre>
              </>
            )}
            {error?.digest && (
              <>
                <p className="mt-4 font-semibold text-foreground">
                  Reference code:
                </p>
                <pre className="whitespace-pre-wrap break-words text-xs text-muted-foreground">
                  {error?.digest}
                </pre>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
