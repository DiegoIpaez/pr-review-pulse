export const PUBLIC_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ACCESS_STATUS: '/access-status',
};

export const ADMIN_ROUTES = {
  ADMIN: '/admin',
  USERS: '/admin/users',
  DASHBOARD: '/admin/dashboard',
  REPOSITORIES: '/admin/repositories',
};

export const COLLABORATOR_ROUTES = {
  MY_PRS: '/collaborator',
  MY_DASHBOARD: '/collaborator/dashboard',
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
} as const;

export const SIDEBAR_TITLE_ROUTES = {
  [ROUTES.ADMIN]: 'Pull Requests',
  [ROUTES.USERS]: 'Users',
  [ROUTES.DASHBOARD]: 'Dashboard',
  [ROUTES.REPOSITORIES]: 'Repositories',
  [ROUTES.MY_PRS]: 'Pull Requests',
  [ROUTES.MY_DASHBOARD]: 'Dashboard',
};
