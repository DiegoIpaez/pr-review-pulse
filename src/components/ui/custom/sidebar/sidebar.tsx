'use client';
import type { SidebarMenuItemProps } from '@/contracts/types';
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarFooter,
} from '@/components/ui/sidebar';
import SidebarItem from './sidebar-Item';

export default function Sidebar({
  title = '',
  items,
  Footer,
}: {
  title?: string;
  items: SidebarMenuItemProps[];
  Footer?: React.ReactNode;
}) {
  return (
    <SidebarPrimitive>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items?.map((item) => (
                <SidebarItem key={item?.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{Footer}</SidebarFooter>
    </SidebarPrimitive>
  );
}
