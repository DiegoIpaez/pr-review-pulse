import { ADMIN_ROUTES, COLLABORATOR_ROUTES } from '@/constants';
import type { UserRole } from '@/generated/prisma/enums';

const ROLE_ROUTES: Record<UserRole, Record<string, string>> = {
  admin: ADMIN_ROUTES,
  user: COLLABORATOR_ROUTES,
};

export function hasAccessToRoute(role: UserRole, pathname: string): boolean {
  const routes = ROLE_ROUTES[role];
  return Object.values(routes).some((route) => pathname.startsWith(route));
}
