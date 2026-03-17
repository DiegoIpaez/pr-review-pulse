'use client';

import { usePathname } from 'next/navigation';
import type { SidebarMenuItemProps } from '@/contracts/types';

export function useSidebarActive(item: SidebarMenuItemProps) {
  const pathname = usePathname();

  const isActive = (url?: string) => {
    if (!url) return false;
    return pathname === url || pathname.startsWith(url + '/');
  };

  const isItemActive = isActive(item.url);

  const isChildActive =
    item.children?.some((child) => isActive(child.url)) ?? false;

  return {
    pathname,
    isItemActive,
    isChildActive,
    isActive,
  };
}
