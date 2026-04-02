'use client';

import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import SidebarThemeDropdown from './sidebar-theme-dropdown';
import SidebarUserDropdown from './sidebar-user-dropdown';

export default function SidebarFooter() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarThemeDropdown />
        <SidebarUserDropdown />
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
