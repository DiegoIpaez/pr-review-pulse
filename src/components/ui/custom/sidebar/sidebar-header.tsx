'use client';

import { SIDEBAR_TITLE_ROUTES } from '@/constants';
import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '../../sidebar';

export default function SidebarHeader() {
  const pathname = usePathname();
  return (
    <header className="flex h-14 items-center border-b px-4 lg:px-6">
      <SidebarTrigger className="cursor-pointer" />
      <h2 className="ml-4 text-base font-medium">
        {SIDEBAR_TITLE_ROUTES?.[pathname]}
      </h2>
    </header>
  );
}
