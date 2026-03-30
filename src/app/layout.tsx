import './globals.css';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import ThemeProvider from '@/components/providers/theme-provider';
import TanstackQueryProvider from '@/components/providers/tanstack-query-provider';

const inter = Inter({ subsets: ['latin'] });

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
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TanstackQueryProvider>
            {children}
            <Toaster richColors />
          </TanstackQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
