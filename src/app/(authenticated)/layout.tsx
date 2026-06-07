'use client';
import Sidebar from '@/components/ui/custom/sidebar/sidebar';
import SidebarHeader from '@/components/ui/custom/sidebar/sidebar-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { menuItems } from '@/constants';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <Sidebar items={menuItems} title="PR Review Pulse" />
      <SidebarInset>
        <div className="flex flex-1 flex-col min-h-screen bg-background">
          <SidebarHeader />
          <main className="flex-1 p-4">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
