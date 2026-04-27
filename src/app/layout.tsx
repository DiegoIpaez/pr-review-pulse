import './globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { SessionProvider } from '@/components/providers/session-provider';
import TanstackQueryProvider from '@/components/providers/tanstack-query-provider';
import ThemeProvider from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: {
    default: 'PR Review Pulse',
    template: 'PR Review Pulse - %s',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={poppins.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <TanstackQueryProvider>
              {children}
              <Toaster richColors />
            </TanstackQueryProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
