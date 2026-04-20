'use client';
import { GitPullRequest } from 'lucide-react';
import Sidebar from '@/components/ui/custom/sidebar/sidebar';
import SidebarHeader from '@/components/ui/custom/sidebar/sidebar-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { SidebarMenuItemProps } from '@/contracts/types';

const items: SidebarMenuItemProps[] = [
  {
    title: 'PRs',
    url: '/',
    icon: GitPullRequest,
    disabled: false,
  },
];

export default function MenuLayout({
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
      <Sidebar items={items} title="PR Review Pulse" />
      <SidebarInset>
        <div className="flex flex-1 flex-col min-h-screen bg-background">
          <SidebarHeader />
          <main className="flex-1 p-4">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
