export * from './reponses.type';

export type RouteParams = { params: Promise<{ id: string }> };

export type Dictionary<T> = { [key: string]: T };

export type SidebarMenuItemProps = {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  children?: SidebarMenuItemProps[];
};

export type NativeButtonType =
  React.ButtonHTMLAttributes<HTMLButtonElement>['type'];

export type ActionBtnProps = {
  type?: NativeButtonType;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  isLoading?: boolean;
  children?: React.ReactNode;
  className?: string;
};

export type PaginationFilters = {
  page: number;
  limit: number;
  search?: string;
  showAll?: boolean;
};

export type MetricsFilters = {
  uid?: number;
  start_date?: string;
  end_date?: string;
};
