const ROUTES = {
  HOME: '/',
  USERS: '/users',
  DASHBOARD: '/dashboard',
};

const API_ROUTES = {
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

const SIDEBAR_TITLE_ROUTES = {
  [ROUTES.HOME]: 'Pull Requests',
  [ROUTES.USERS]: 'Users',
  [ROUTES.DASHBOARD]: 'Dashboard',
};

export { ROUTES, API_ROUTES, SIDEBAR_TITLE_ROUTES };
