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
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return (savedTheme as ThemeName) || defaultTheme;
  });

  const currentTheme = themes[themeName];

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
  }, [themeName]);

  const setTheme = (newThemeName: ThemeName) => {
    setThemeName(newThemeName);
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