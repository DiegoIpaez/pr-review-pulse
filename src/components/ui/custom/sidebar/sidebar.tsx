'use client';
import { useSession } from 'next-auth/react';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  Sidebar as SidebarPrimitive,
} from '@/components/ui/sidebar';
import type { SidebarMenuItemProps } from '@/contracts/types';
import type { UserRole } from '@/generated/prisma/enums';
import SidebarFooter from './sidebar-footer/sidebar-footer';
import SidebarItem from './sidebar-item';

type SidebarProps = {
  title?: string;
  items: SidebarMenuItemProps[];
};

function filterItemsByRole(
  items: SidebarMenuItemProps[],
  role: string
): SidebarMenuItemProps[] {
  return items
    .filter((item) => !item.roles || item.roles.includes(role as UserRole))
    .map((item) => ({
      ...item,
      children: item.children
        ? filterItemsByRole(item.children, role)
        : undefined,
    }));
}

export default function Sidebar({ title = '', items }: SidebarProps) {
  const { data: session } = useSession();
  const role = session?.user?.role ?? '';
  const filteredItems = filterItemsByRole(items, role);

  return (
    <SidebarPrimitive>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{title}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems?.map((item) => (
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
