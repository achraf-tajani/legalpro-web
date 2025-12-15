  import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type Theme, type ThemeName, themes, defaultTheme } from '../config/themes.config';

interface ThemeContextType {
  currentTheme: Theme;
  themeName: ThemeName;
  setTheme: (themeName: ThemeName) => void;
  availableThemes: typeof themes;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'legalpro-theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeName, setThemeNameState] = useState<ThemeName>(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    return defaultTheme;
  });

  const currentTheme = themes[themeName];

  // 🎨 INJECTION DES CSS VARIABLES
  useEffect(() => {
    const root = document.documentElement;
    
    // Appliquer toutes les couleurs RGB comme variables CSS
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Ajouter l'attribut data-theme pour faciliter le debug
    root.setAttribute('data-theme', themeName);
  }, [currentTheme, themeName]);

  const setTheme = (newThemeName: ThemeName) => {
    setThemeNameState(newThemeName);
    localStorage.setItem(THEME_STORAGE_KEY, newThemeName);
  };

  const value: ThemeContextType = {
    currentTheme,
    themeName,
    setTheme,
    availableThemes: themes,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};