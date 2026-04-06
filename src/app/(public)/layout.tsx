import CanvasParticles from '@/components/common/canvas-particles';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CanvasParticles />
      {children}
    </>
  );
}
