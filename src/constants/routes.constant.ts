export const PUBLIC_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ACCESS_STATUS: '/access-status',
};

export const ADMIN_ROUTES = {
  PRS: '/prs',
  DASHBOARD: '/dashboard',
  REPOSITORIES: '/repositories',
  USERS: '/users',
};

export const COLLABORATOR_ROUTES = {
  PRS_ME: '/prs/me',
  DASHBOARD_ME: '/dashboard/me',
};

export const ROUTES = {
  ...ADMIN_ROUTES,
  ...COLLABORATOR_ROUTES,
} as const;

export const API_ROUTES = {
  PULL_REQUESTS: {
    BASE: '/pull-requests',
    DISTRIBUTION: '/pull-requests/distribution',
    KPIS: '/pull-requests/kpis',
    STATS: '/pull-requests/stats',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id: number) => `/users/${id}`,
    ME: {
      PULL_REQUESTS: {
        BASE: '/users/me/pull-requests',
        KPIS: '/users/me/pull-requests/kpis',
        STATS: '/users/me/pull-requests/stats',
        DISTRIBUTION: '/users/me/pull-requests/distribution',
      },
    },
  },
  REPOSITORIES: {
    BASE: '/repositories',
  },
  LABELS: {
    BASE: '/labels',
  },
} as const;

export const SIDEBAR_TITLE_ROUTES: Record<string, string> = {
  [ROUTES.PRS]: 'Pull Requests',
  [ROUTES.PRS_ME]: 'My Pull Requests',
  [ROUTES.USERS]: 'Users',
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.DASHBOARD_ME]: 'My Dashboard',
  [ROUTES.REPOSITORIES]: 'Repositories',
};
