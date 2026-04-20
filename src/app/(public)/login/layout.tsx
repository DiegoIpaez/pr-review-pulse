import type { Metadata } from 'next';
import FloatingFooter from './_components/floating-footer';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <FloatingFooter />
    </>
  );
}
