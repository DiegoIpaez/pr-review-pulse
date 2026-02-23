'use client';
import clsx from 'clsx';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import type { SidebarMenuItemProps } from '@/contracts/types';

function SimpleMenuItem({ item }: { item: SidebarMenuItemProps }) {
  const handleClick = (event: React.MouseEvent) => {
    if (item?.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  };
  return (
    <SidebarMenuItem key={item?.title}>
      <SidebarMenuButton
        className={clsx({
          'opacity-50 cursor-not-allowed': item?.disabled,
        })}
        disabled={item?.disabled}
        asChild
      >
        <Link href={item?.url} onClick={handleClick}>
          <item.icon />
          <span>{item?.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export default function SidebarItemCs({
  item,
}: {
  item: SidebarMenuItemProps;
}) {
  if (item?.children == null) return <SimpleMenuItem item={item} />;
  return (
    <Collapsible defaultOpen key={item.title} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="cursor-pointer">
            <item.icon />
            <span>{item?.title}</span>
            <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item?.children.map((sub) => {
              const handleSubClick = (event: React.MouseEvent) => {
                if (sub?.disabled) {
                  event.preventDefault();
                  event.stopPropagation();
                }
              };
              return (
                <SidebarMenuSubItem key={sub?.title}>
                  <SidebarMenuButton
                    disabled={sub?.disabled}
                    className={clsx({
                      'opacity-50 cursor-not-allowed': sub?.disabled,
                    })}
                    asChild
                  >
                    <Link href={sub?.url} onClick={handleSubClick}>
                      <sub.icon className="w-4 h-4" />
                      <span>{sub?.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
