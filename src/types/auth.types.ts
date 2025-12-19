export interface User {
  id: string;
  email: string;
  type_utilisateur: 'ADMIN' | 'AVOCAT' | 'CLIENT';
  avocatId?: string;
  client_id?: string;
}

export interface LoginResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}