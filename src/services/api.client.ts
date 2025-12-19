import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG, API_ENDPOINTS } from '../config/api.config';
import { ROUTES } from '../config/routes.config';

class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Ajouter le token
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - Gérer refresh token
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const isLoginRequest = originalRequest?.url?.includes(API_ENDPOINTS.AUTH.LOGIN);
        if (isLoginRequest) 
          return Promise.reject(error);
        // Si 401 et pas déjà retry
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // Attendre que le refresh soit terminé
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this.client(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            
            if (!refreshToken) {
              throw new Error('No refresh token');
            }

            // Appel refresh token
            const response = await axios.post(
              `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
              { refreshToken }
            );

            const { accessToken } = response.data;

            // Sauvegarder nouveau token
            localStorage.setItem('accessToken', accessToken);

            // Notifier les requêtes en attente
            this.refreshSubscribers.forEach((callback) => callback(accessToken));
            this.refreshSubscribers = [];

            // Retry la requête originale
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return this.client(originalRequest);

          } catch (refreshError) {
            // Refresh failed → logout
            this.clearTokens();
            window.location.href = ROUTES.AUTH.LOGIN;
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  public getClient(): AxiosInstance {
    return this.client;
  }
}

// Export singleton
export const apiClient = new ApiClient().getClient();