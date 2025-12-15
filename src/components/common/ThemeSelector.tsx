import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import type { ThemeName } from '../../config/themes.config';

export default function ThemeSelector() {
  const { currentTheme, themeName, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleThemeChange = (newTheme: ThemeName) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bouton actuel */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg transition-colors text-theme-muted hover:text-theme-primary flex items-center space-x-2"
        title="Changer de thème"
      >
        <span className="text-xl">{currentTheme.icon}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-theme-surface border-theme border rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="p-2 space-y-1">
            {Object.entries(availableThemes).map(([key, theme]) => {
              const isActive = themeName === key;
              
              return (
                <button
                  key={key}
                  onClick={() => handleThemeChange(key as ThemeName)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-theme-tertiary border border-accent-gradient'
                      : 'hover:bg-theme-tertiary border border-transparent'
                  }`}
                  style={isActive ? {
                    borderColor: `rgb(var(--color-accentStart))`
                  } : undefined}
                >
                  {/* Icône du thème */}
                  <span className="text-2xl">{theme.icon}</span>
                  
                  {/* Nom */}
                  <div className="flex-1 text-left">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-theme-primary' : 'text-theme-secondary'
                    }`}>
                      {theme.label}
                    </p>
                  </div>

                  {/* Indicateur actif */}
                  {isActive && (
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: `rgb(var(--color-accentStart))` }}></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer info */}
          <div className="px-3 py-2 bg-theme-tertiary border-theme border-t">
            <p className="text-xs text-theme-muted text-center">
              Thème : <span className="text-theme-secondary font-medium">{currentTheme.label}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}