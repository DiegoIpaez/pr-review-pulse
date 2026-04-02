const ROUTES = {
  HOME: '/',
  USERS: '/users',
  DASHBOARD: '/dashboard',
};

const API_ROUTES = {
  USERS: '/users',
  PULL_REQUESTS: '/pull-requests',
};

const SIDEBAR_TITLE_ROUTES = {
  [ROUTES.HOME]: 'Pull Requests',
  [ROUTES.USERS]: 'Users',
  [ROUTES.DASHBOARD]: 'Dashboard',
};

export { ROUTES, API_ROUTES, SIDEBAR_TITLE_ROUTES };
