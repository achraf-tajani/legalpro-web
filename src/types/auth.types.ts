export interface User {
  id: string;
  email: string;
  type_utilisateur: 'avocat' | 'client' | 'admin';
  avocat_id?: string;
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