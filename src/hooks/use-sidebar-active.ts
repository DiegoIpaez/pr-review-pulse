'use client';

import { usePathname } from 'next/navigation';
import type { SidebarMenuItemProps } from '@/contracts/types';

export function useSidebarActive(item: SidebarMenuItemProps) {
  const pathname = usePathname();

  const isActive = (url?: string) => {
    if (!url) return false;
    const normalizedUrl =
      url.endsWith('/') && url !== '/' ? url.slice(0, -1) : url;
    const normalizedPathname =
      pathname.endsWith('/') && pathname !== '/'
        ? pathname.slice(0, -1)
        : pathname;

    return normalizedPathname === normalizedUrl;
  };

  const isChildActive =
    item.children?.some((child) => isActive(child.url)) ?? false;

  const isItemActive = isChildActive ? false : isActive(item.url);

  return {
    pathname,
    isItemActive,
    isChildActive,
    isActive,
  };
}
