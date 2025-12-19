export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL,
  TIMEOUT: 30000,
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  AVOCATS: {
    LIST: '/avocats',
    ME: '/avocats/me',
    BY_ID: (id: string) => `/avocats/${id}`,
  },
  CLIENTS: {
    LIST: '/clients',
    BY_ID: (id: string) => `/clients/${id}`,
    SEARCH: '/clients/search',
  },
  DOSSIERS: {
    LIST: '/dossiers',
    BY_ID: (id: string) => `/dossiers/${id}`,
    STATS: '/dossiers/stats',
  },
  PROCEDURES: {
    LIST: '/procedures',
    BY_ID: (id: string) => `/procedures/${id}`,
  },
  TACHES: {
    LIST: '/taches',
    BY_ID: (id: string) => `/taches/${id}`,
    STATS: '/taches/stats',
  },
  NOTES: {
    LIST: '/notes',
    BY_ID: (id: string) => `/notes/${id}`,
  },
  FACTURES: {
    LIST: '/factures',
    BY_ID: (id: string) => `/factures/${id}`,
    STATS: '/factures/stats',
  },
  DOCUMENTS: {
    LIST: '/documents',
    BY_ID: (id: string) => `/documents/${id}`,
    UPLOAD: '/documents/upload',
  },
  ALERTES: {
    LIST: '/alertes',
    MY_ALERTS: '/alertes/mes-alertes',
    UNREAD: '/alertes/non-lues',
    COUNT_UNREAD: '/alertes/count-non-lues',
  },
  UTILISATEURS: {
    CHANGE_PASSWORD: '/utilisateurs/change-password',
  },
  ADVERSAIRES: {
    LIST: '/adversaires',
    BY_ID: (id: string) => `/adversaires/${id}`,
    BY_DOSSIER: (dossierId: string) => `/adversaires/dossier/${dossierId}`,
  },
} as const;