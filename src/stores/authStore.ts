import { create } from 'zustand';
import { authService } from '../services/auth.service';
import type { User } from '../types/auth.types';

interface AuthState {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // État initial
  user: authService.getStoredUser(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,

  // Login
  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const { user } = await authService.login(email, password);
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Email ou mot de passe incorrect';
      set({ 
        isLoading: false, 
        error: errorMessage,
        isAuthenticated: false,
        user: null
      });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    set({ isLoading: true });
    
    try {
      await authService.logout();
    } finally {
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        error: null
      });
    }
  },

  // Vérifier l'auth au démarrage
  checkAuth: () => {
    const user = authService.getStoredUser();
    const isAuthenticated = authService.isAuthenticated();
    
    set({ user, isAuthenticated });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));