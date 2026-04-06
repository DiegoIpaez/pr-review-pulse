'use client';
import { ChartSpline, GitPullRequest, Users2 } from 'lucide-react';
import { SidebarMenuItemProps } from '@/contracts/types';
import Sidebar from '@/components/ui/custom/sidebar/sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import SidebarHeader from '@/components/ui/custom/sidebar/sidebar-header';

const items: SidebarMenuItemProps[] = [
  {
    title: 'Dashboard',
    url: '/admin/dashboard',
    icon: ChartSpline,
    disabled: false,
  },
  {
    title: 'PRs',
    url: '/admin',
    icon: GitPullRequest,
    disabled: false,
  },
  {
    title: 'Users',
    url: '/admin/users',
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
