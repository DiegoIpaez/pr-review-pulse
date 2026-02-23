'use client';

import { useState } from 'react';
import ButtonCs from '@/components/ui/custom/ButtonCs';

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorBoundaryProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center  bg-gradient-to-b from-background to-muted">
      <h1 className="text-3xl font-bold text-white">
        Ha ocurrido un error inesperado
      </h1>
      <p className="mt-2 text-gray-400 max-w-md">
        Lamentamos los inconvenientes. Nuestro equipo ha sido notificado y
        estamos trabajando para solucionarlo.
      </p>
      <div className="flex gap-4 mt-6">
        <ButtonCs
          className="shadow-md hover:shadow-lg transition-all duration-200"
          onClick={reset}
        >
          Intentar nuevamente
        </ButtonCs>
        <ButtonCs
          variant="outline"
          className="bg-gray-700"
          onClick={() => setShowDetails((prev) => !prev)}
        >
          {showDetails ? 'Ocultar detalles' : 'Ver detalles'}
        </ButtonCs>
      </div>
      {showDetails && (
        <div className="mt-6 w-full max-w-2xl max-h-[40vh] overflow-y-scroll bg-gray-100 text-left rounded-lg p-4 overflow-auto border border-gray-300">
          <p className="font-semibold text-gray-800">Mensaje:</p>
          <pre className="whitespace-pre-wrap break-words text-sm text-red-600">
            {error?.message}
          </pre>
          {error?.stack && (
            <>
              <p className="mt-4 font-semibold text-gray-800">Stack trace:</p>
              <pre className="whitespace-pre-wrap break-words text-xs text-gray-700">
                {error?.stack}
              </pre>
            </>
          )}
          {error?.digest && (
            <>
              <p className="mt-4 font-semibold text-gray-800">
                Código de referencia:
              </p>
              <pre className="whitespace-pre-wrap break-words text-xs text-gray-700">
                {error?.digest}
              </pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}
