import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Docs',
  description: 'Template Api documentation',
};

export default function DocsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
