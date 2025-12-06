// src/config/routes.config.ts

export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
  },
  DASHBOARD: {
    HOME: '/',
    DOSSIERS: '/dossiers',
    DOSSIER_DETAIL: (id: string) => `/dossiers/${id}`,
    CLIENTS: '/clients',
    CLIENT_DETAIL: (id: string) => `/clients/${id}`,
    TACHES: '/taches',
    FACTURES: '/factures',
    DOCUMENTS: '/documents',
    CALENDRIER: '/calendrier',
  },
} as const;