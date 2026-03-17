'use client';
import { ChartSpline, GitPullRequest, Users2 } from 'lucide-react';
import { SidebarMenuItemProps } from '@/contracts/types';
import SidebarCs from '@/components/ui/custom/sidebar/sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import SidebarHeaderCs from '@/components/ui/custom/sidebar/sidebar-header';

const items: SidebarMenuItemProps[] = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: ChartSpline,
    disabled: true,
  },
  {
    title: 'PRs',
    url: '/',
    icon: GitPullRequest,
    disabled: false,
  },
  {
    title: 'Users',
    url: '/users',
    icon: Users2,
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
      <SidebarCs items={items} title="PR Review Pulse" />
      <SidebarInset>
        <div className="flex flex-1 flex-col min-h-screen bg-background">
          <SidebarHeaderCs />
          <main className="flex-1 p-4">{children}</main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
