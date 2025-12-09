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
        className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white flex items-center space-x-2"
        title="Changer de thème"
      >
        <span className="text-xl">{currentTheme.icon}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="p-2 space-y-1">
            {Object.entries(availableThemes).map(([key, theme]) => {
              const isActive = themeName === key;
              
              return (
                <button
                  key={key}
                  onClick={() => handleThemeChange(key as ThemeName)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                    isActive
                      ? 'bg-slate-800 border border-indigo-500/50'
                      : 'hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  {/* Icône du thème */}
                  <span className="text-2xl">{theme.icon}</span>
                  
                  {/* Nom + preview */}
                  <div className="flex-1 text-left">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-white' : 'text-slate-300'
                    }`}>
                      {theme.label}
                    </p>
                  </div>

                  {/* Indicateur actif */}
                  {isActive && (
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer info */}
          <div className="px-3 py-2 bg-slate-800/50 border-t border-slate-700">
            <p className="text-xs text-slate-500 text-center">
              Thème : <span className="text-slate-400 font-medium">{currentTheme.label}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}