'use client';
import type { SidebarMenuItemProps } from '@/contracts/types';
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from '@/components/ui/sidebar';
import SidebarItem from './sidebar-Item';
import SidebarFooter from './sidebar-footer/sidebar-footer';

type SidebarProps = {
  title?: string;
  items: SidebarMenuItemProps[];
};

export default function Sidebar({ title = '', items }: SidebarProps) {
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
      <SidebarFooter />
    </SidebarPrimitive>
  );
}
