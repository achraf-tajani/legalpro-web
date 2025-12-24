export type ThemeName = 'dark' | 'light';

export interface ThemeColors {
  // Backgrounds (valeurs RGB)
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  
  // Surfaces
  surface: string;
  
  // Borders
  border: string;
  borderHover: string;
  
  // Text
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textLabel: string;
  
  // Accents (pour gradients et solides)
  accentStart: string;    // Début du gradient
  accentEnd: string;      // Fin du gradient
  accentSecondaryStart: string;
  accentSecondaryEnd: string;
  
  // Status
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface Theme {
  name: ThemeName;
  label: string;
  icon: string;
  colors: ThemeColors;
  // Classes Tailwind pré-générées
  classes: {
    // Backgrounds
    bgPrimary: string;
    bgSecondary: string;
    bgTertiary: string;
    
    // Surfaces (avec backdrop blur)
    surface: string;
    
    // Borders
    border: string;
    borderHover: string;
    
    // Text
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    textLabel: string;
    
    // Gradients (boutons, cards spéciales)
    accentGradient: string;           // from-X to-Y
    accentGradientHover: string;      // hover:from-X hover:to-Y
    accentSecondaryGradient: string;
    
    // Variants hover
    bgTertiaryHover: string;
    
    // Status colors
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

export const themes: Record<ThemeName, Theme> = {
  // 🌙 DARK MODE
  dark: {
    name: 'dark',
    label: 'Dark',
    icon: '🌙',
    colors: {
      bgPrimary: '2, 6, 23',        // slate-950
      bgSecondary: '15, 23, 42',    // slate-900
      bgTertiary: '30, 41, 59',     // slate-800
      
      surface: '15, 23, 42',        // slate-900
      
      border: '30, 41, 59',         // slate-800
      borderHover: '51, 65, 85',    // slate-700
      
      textPrimary: '255, 255, 255', // white
      textSecondary: '203, 213, 225', // slate-300
      textMuted: '148, 163, 184',   // slate-400
      textLabel: '170, 170, 170',   // slate-200
      
      accentStart: '99, 102, 241',  // indigo-500
      accentEnd: '147, 51, 234',    // purple-600
      accentSecondaryStart: '16, 185, 129', // emerald-500
      accentSecondaryEnd: '20, 184, 166',   // teal-600
      
      success: '34, 197, 94',       // green-500
      warning: '234, 179, 8',       // yellow-500
      error: '239, 68, 68',         // red-500
      info: '59, 130, 246',         // blue-500
    },
    classes: {
      bgPrimary: 'bg-theme-primary',
      bgSecondary: 'bg-theme-secondary',
      bgTertiary: 'bg-theme-tertiary',
      
      surface: 'bg-theme-secondary/50 backdrop-blur-xl',
      
      border: 'border-slate-800',
      borderHover: 'hover:border-slate-700',
      
      textPrimary: 'text-white',
      textSecondary: 'text-slate-300',
      textMuted: 'text-slate-400',
      textLabel: 'text-slate-200',
      
      accentGradient: 'bg-gradient-to-r from-indigo-500 to-purple-600',
      accentGradientHover: 'hover:from-indigo-600 hover:to-purple-700',
      accentSecondaryGradient: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      
      bgTertiaryHover: 'hover:bg-theme-tertiary',
      
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
      bgPrimary: '249, 250, 251',   // gray-50
      bgSecondary: '255, 255, 255', // white
      bgTertiary: '243, 244, 246',  // gray-100
      
      surface: '255, 255, 255',     // white
      
      border: '229, 231, 235',      // gray-200
      borderHover: '209, 213, 219', // gray-300
      
      textPrimary: '17, 24, 39',    // gray-900
      textSecondary: '55, 65, 81',  // gray-700
      textMuted: '107, 114, 128',   // gray-500
      textLabel: '75, 85, 99',      // gray-600
      
      accentStart: '79, 70, 229',   // indigo-600
      accentEnd: '126, 34, 206',    // purple-700
      accentSecondaryStart: '5, 150, 105',  // emerald-600
      accentSecondaryEnd: '13, 148, 136',   // teal-600
      
      success: '34, 197, 94',       // green-500
      warning: '234, 179, 8',       // yellow-500
      error: '239, 68, 68',         // red-500
      info: '59, 130, 246',         // blue-500
    },
    classes: {
      bgPrimary: 'bg-gray-50',
      bgSecondary: 'bg-white',
      bgTertiary: 'bg-gray-100',
      
      surface: 'bg-white/90 backdrop-blur-xl shadow-lg',
      
      border: 'border-gray-200',
      borderHover: 'hover:border-gray-300',
      
      textPrimary: 'text-gray-900',
      textSecondary: 'text-gray-700',
      textMuted: 'text-gray-500',
      textLabel: 'text-gray-600',
      
      accentGradient: 'bg-gradient-to-r from-indigo-600 to-purple-700',
      accentGradientHover: 'hover:from-indigo-700 hover:to-purple-800',
      accentSecondaryGradient: 'bg-gradient-to-r from-emerald-600 to-teal-600',
      
      bgTertiaryHover: 'hover:bg-gray-200',
      
      success: 'bg-green-100 text-green-700 border-green-300',
      warning: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      error: 'bg-red-100 text-red-700 border-red-300',
      info: 'bg-blue-100 text-blue-700 border-blue-300',
    },
  },
};

export const defaultTheme: ThemeName = 'dark';

export const rgba = (rgbString: string, alpha: number = 1): string => {
  return `rgba(${rgbString}, ${alpha})`;
};