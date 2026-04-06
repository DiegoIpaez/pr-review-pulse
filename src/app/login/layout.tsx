import { Metadata } from 'next';
import CanvasParticles from '@/components/common/canvas-particles';
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
      <CanvasParticles />
      {children}
      <FloatingFooter />
    </>
  );
}
