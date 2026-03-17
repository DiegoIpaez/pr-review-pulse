'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import type { SidebarMenuItemProps } from '@/contracts/types';
import { useSidebarActive } from '@/hooks/use-sidebar-active';
import { cn } from '@/lib/cn';
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

function SimpleMenuItem({ item }: { item: SidebarMenuItemProps }) {
  const { isActive } = useSidebarActive(item);
  const active = isActive(item.url);

  const handleClick = (event: React.MouseEvent) => {
    if (item?.disabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  return (
    <SidebarMenuItem key={item?.title}>
      <SidebarMenuButton
        className={cn({
          'opacity-50 cursor-not-allowed': item?.disabled,
          'bg-muted font-medium': active,
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
  const { isChildActive, isActive } = useSidebarActive(item);

  if (!item?.children) return <SimpleMenuItem item={item} />;
  return (
    <Collapsible defaultOpen={isChildActive} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton
            className={cn('cursor-pointer', {
              'bg-muted font-medium': isChildActive || isActive(item.url),
            })}
          >
            <item.icon />
            <span>{item?.title}</span>
            <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {item?.children.map((sub) => {
              const active = isActive(sub.url);

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
                    className={cn({
                      'opacity-50 cursor-not-allowed': sub?.disabled,
                      'bg-muted font-medium': active,
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
