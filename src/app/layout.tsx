import './globals.css';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import ThemeProvider from '@/components/providers/ThemeProvider';
import TanstackQueryProvider from '@/components/providers/TanstackQueryProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'TemplateApp',
    template: 'TemplateApp - %s',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
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
