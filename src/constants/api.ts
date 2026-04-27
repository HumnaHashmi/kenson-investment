/**
 * API endpoint paths (relative to base URL).
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USER: {
    PROFILE: '/user/profile',
    UPDATE: '/user/update',
  },
  PORTFOLIO: {
    LIST: '/portfolio',
    DETAIL: (id: string) => `/portfolio/${id}`,
  },
} as const;
