'use client';
import { Check, Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useHydrated } from '@/hooks/use-hydrated';
import { cn } from '@/lib/cn';

const THEMES = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
] as const;

type Theme = (typeof THEMES)[number];

export default function SidebarThemeDropdown() {
  const hydrated = useHydrated();
  const { theme, setTheme } = useTheme();

  if (!hydrated) {
    return (
      <SidebarMenuButton size="lg" className="cursor-not-allowed opacity-50">
        <Skeleton className="flex size-8 rounded-lg" />
        <div className="grid flex-1 gap-1.5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </SidebarMenuButton>
    );
  }

  const activeTheme: Theme =
    THEMES?.find((item) => item.value === theme) ?? THEMES[2];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <activeTheme.icon className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">Theme</span>
            <span className="truncate text-xs text-muted-foreground">
              {activeTheme.label}
            </span>
          </div>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        side="right"
        sideOffset={4}
      >
        {THEMES.map(({ value, icon: Icon, label }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            className="cursor-pointer gap-2"
          >
            <Icon className="mr-2 size-4" />
            <span>{label}</span>
            <Check
              className={cn(
                'ml-auto size-4',
                activeTheme.value === value ? 'opacity-100' : 'opacity-0'
              )}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
