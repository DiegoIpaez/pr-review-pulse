'use client';
import type { SidebarMenuItemProps } from '@/contracts/types';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarFooter,
} from '@/components/ui/sidebar';
import SidebarItemCs from './sidebar-Item';

export default function SidebarCs({
  title = '',
  items,
  Footer,
}: {
  title?: string;
  items: SidebarMenuItemProps[];
  Footer?: React.ReactNode;
}) {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items?.map((item) => (
                <SidebarItemCs key={item?.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{Footer}</SidebarFooter>
    </Sidebar>
  );
}
