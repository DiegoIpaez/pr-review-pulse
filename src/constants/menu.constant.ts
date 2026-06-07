import { ChartSpline, FolderGit2, GitPullRequest, Users2 } from 'lucide-react';
import type { SidebarMenuItemProps } from '@/contracts/types';

export const menuItems: SidebarMenuItemProps[] = [
  {
    title: 'Dashboard',
    icon: ChartSpline,
    url: '#',
    children: [
      {
        title: 'Global metrics',
        url: '/dashboard',
        icon: ChartSpline,
        roles: ['admin'],
      },
      {
        title: 'My metrics',
        url: '/dashboard/me',
        icon: ChartSpline,
        roles: ['admin', 'user'],
      },
    ],
  },
  {
    title: 'PRs',
    icon: GitPullRequest,
    url: '#',
    children: [
      {
        title: 'All PRs',
        url: '/prs',
        icon: GitPullRequest,
        roles: ['admin'],
      },
      {
        title: 'My PRs',
        url: '/prs/me',
        icon: GitPullRequest,
        roles: ['admin', 'user'],
      },
    ],
  },
  {
    title: 'Repositories',
    url: '/repositories',
    icon: FolderGit2,
    roles: ['admin'],
  },
  {
    title: 'Users',
    url: '/users',
    icon: Users2,
    roles: ['admin'],
  },
];
