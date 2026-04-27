'use client';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  Sidebar as SidebarPrimitive,
} from '@/components/ui/sidebar';
import type { SidebarMenuItemProps } from '@/contracts/types';
import SidebarFooter from './sidebar-footer/sidebar-footer';
import SidebarItem from './sidebar-item';

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
