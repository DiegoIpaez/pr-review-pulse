export const PUBLIC_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ACCESS_STATUS: '/access-status',
};

export const ADMIN_ROUTES = {
  ADMIN: '/admin',
  USERS: '/admin/users',
  DASHBOARD: '/admin/dashboard',
};

export const COLLABORATOR_ROUTES = {
  COLLABORATOR: '/collaborator',
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
} as const;

export const SIDEBAR_TITLE_ROUTES = {
  [ROUTES.ADMIN]: 'Pull Requests',
  [ROUTES.USERS]: 'Users',
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.COLLABORATOR]: 'Pull Requests',
};
