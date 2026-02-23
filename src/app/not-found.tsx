import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404',
};

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted">
      <div className="flex flex-col items-center justify-center text-center min-h-[50vh]">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="mt-4 text-lg text-gray-400">
          ¡Vaya! La página que buscas no se encontró.
        </p>
        <Link
          href={'/'}
          className="mt-6 inline-block px-6 py-3 bg-gray-100 text-gray-800 rounded-xl hover:opacity-70"
        >
          Volver a la página de inicio
        </Link>
      </div>
    </div>
  );
}
