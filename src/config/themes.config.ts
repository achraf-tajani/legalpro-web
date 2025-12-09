export type ThemeName = 'dark' | 'light' | 'hot' | 'cold';

export interface Theme {
  name: ThemeName;
  label: string;
  icon: string;
  colors: {
    // Backgrounds
    bgPrimary: string;
    bgSecondary: string;
    bgTertiary: string;
    bgHover: string;
    
    // Surfaces (cards, modals)
    surface: string;
    surfaceHover: string;
    
    // Borders
    border: string;
    borderHover: string;
    
    // Text
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    
    // Accents (boutons, liens, highlights)
    accentPrimary: string;
    accentPrimaryHover: string;
    accentSecondary: string;
    accentSecondaryHover: string;
    
    // Status colors
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export const themes: Record<ThemeName, Theme> = {
  // 🌙 DARK MODE (actuel)
  dark: {
    name: 'dark',
    label: 'Dark',
    icon: '🌙',
    colors: {
      bgPrimary: 'bg-slate-950',
      bgSecondary: 'bg-slate-900',
      bgTertiary: 'bg-slate-800',
      bgHover: 'hover:bg-slate-800',
      
      surface: 'bg-slate-900/50 backdrop-blur-xl',
      surfaceHover: 'hover:bg-slate-800/50',
      
      border: 'border-slate-800',
      borderHover: 'hover:border-slate-700',
      
      textPrimary: 'text-white',
      textSecondary: 'text-slate-300',
      textMuted: 'text-slate-400',
      
      accentPrimary: 'bg-gradient-to-r from-indigo-500 to-purple-600',
      accentPrimaryHover: 'hover:from-indigo-600 hover:to-purple-700',
      accentSecondary: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      accentSecondaryHover: 'hover:from-emerald-600 hover:to-teal-700',
      
      success: 'bg-green-500/20 text-green-400 border-green-500/30',
      warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      error: 'bg-red-500/20 text-red-400 border-red-500/30',
      info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    },
  },

  // ☀️ LIGHT MODE
  light: {
    name: 'light',
    label: 'Light',
    icon: '☀️',
    colors: {
      bgPrimary: 'bg-gray-50',
      bgSecondary: 'bg-white',
      bgTertiary: 'bg-gray-100',
      bgHover: 'hover:bg-gray-100',
      
      surface: 'bg-white/90 backdrop-blur-xl shadow-lg',
      surfaceHover: 'hover:bg-gray-50/90',
      
      border: 'border-gray-200',
      borderHover: 'hover:border-gray-300',
      
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-700',
      textMuted: 'text-gray-500',
      
      accentPrimary: 'bg-gradient-to-r from-indigo-600 to-purple-600',
      accentPrimaryHover: 'hover:from-indigo-700 hover:to-purple-700',
      accentSecondary: 'bg-gradient-to-r from-emerald-600 to-teal-600',
      accentSecondaryHover: 'hover:from-emerald-700 hover:to-teal-700',
      
      success: 'bg-green-100 text-green-700 border-green-300',
      warning: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      error: 'bg-red-100 text-red-700 border-red-300',
      info: 'bg-blue-100 text-blue-700 border-blue-300',
    },
  },

  // 🔥 HOT MODE
  hot: {
    name: 'hot',
    label: 'Hot',
    icon: '🔥',
    colors: {
      bgPrimary: 'bg-gradient-to-br from-red-950 via-orange-950 to-yellow-950',
      bgSecondary: 'bg-red-900/50',
      bgTertiary: 'bg-orange-900/50',
      bgHover: 'hover:bg-red-800/50',
      
      surface: 'bg-gradient-to-br from-red-900/40 via-orange-900/40 to-yellow-900/40 backdrop-blur-xl',
      surfaceHover: 'hover:from-red-800/50 hover:via-orange-800/50 hover:to-yellow-800/50',
      
      border: 'border-orange-800/50',
      borderHover: 'hover:border-orange-600/70',
      
      textPrimary: 'text-orange-50',
      textSecondary: 'text-orange-200',
      textMuted: 'text-orange-400',
      
      accentPrimary: 'bg-gradient-to-r from-red-500 to-orange-500',
      accentPrimaryHover: 'hover:from-red-600 hover:to-orange-600',
      accentSecondary: 'bg-gradient-to-r from-orange-500 to-yellow-500',
      accentSecondaryHover: 'hover:from-orange-600 hover:to-yellow-600',
      
      success: 'bg-green-500/20 text-green-300 border-green-500/30',
      warning: 'bg-yellow-500/30 text-yellow-200 border-yellow-500/40',
      error: 'bg-red-500/30 text-red-200 border-red-500/40',
      info: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    },
  },

  // ❄️ COLD MODE
  cold: {
    name: 'cold',
    label: 'Cold',
    icon: '❄️',
    colors: {
      bgPrimary: 'bg-gradient-to-br from-blue-950 via-cyan-950 to-teal-950',
      bgSecondary: 'bg-blue-900/50',
      bgTertiary: 'bg-cyan-900/50',
      bgHover: 'hover:bg-blue-800/50',
      
      surface: 'bg-gradient-to-br from-blue-900/40 via-cyan-900/40 to-teal-900/40 backdrop-blur-xl',
      surfaceHover: 'hover:from-blue-800/50 hover:via-cyan-800/50 hover:to-teal-800/50',
      
      border: 'border-cyan-800/50',
      borderHover: 'hover:border-cyan-600/70',
      
      textPrimary: 'text-cyan-50',
      textSecondary: 'text-cyan-200',
      textMuted: 'text-cyan-400',
      
      accentPrimary: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      accentPrimaryHover: 'hover:from-blue-600 hover:to-cyan-600',
      accentSecondary: 'bg-gradient-to-r from-cyan-500 to-teal-500',
      accentSecondaryHover: 'hover:from-cyan-600 hover:to-teal-600',
      
      success: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      warning: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      error: 'bg-red-500/20 text-red-300 border-red-500/30',
      info: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    },
  },
};

export const defaultTheme: ThemeName = 'dark';