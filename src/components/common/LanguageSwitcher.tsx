import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MdLanguage } from 'react-icons/md';
import { useTheme } from '../../contexts/ThemeContext';

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇲🇦' },
];

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal';
}

export default function LanguageSwitcher({ variant = 'default' }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const { currentTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('language', code);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'minimal') {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`p-2 rounded-lg transition-colors ${currentTheme.classes.textMuted}`}
          style={{ backgroundColor: 'transparent' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(100, 116, 139, 0.1)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <span className="text-xl">{currentLanguage.flag}</span>
        </button>

        {isOpen && (
          <div className={`absolute top-full right-0 mt-2 w-48 ${currentTheme.classes.bgPrimary} ${currentTheme.classes.border} border rounded-xl shadow-2xl overflow-hidden z-50`}>
            {languages.map((lang) => {
              const isActive = currentLanguage.code === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 transition-colors ${
                    isActive 
                      ? `${currentTheme.classes.bgTertiary}` 
                      : `${currentTheme.classes.bgTertiaryHover}`
                  }`}
                >
                  <span className={`text-xl opacity-60 ${currentTheme.classes.textPrimary}`}>{lang.flag}</span>
                  <span className={`text-sm font-medium ${currentTheme.classes.textPrimary}`}>{lang.name}</span>
                  {isActive && (
                    <svg className="w-4 h-4 ml-auto" style={{ color: `rgb(${currentTheme.colors.accentStart})` }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 ${currentTheme.classes.bgTertiary} ${currentTheme.classes.border} border rounded-lg transition-all ${currentTheme.classes.textSecondary}`}
        style={{ 
          backgroundColor: `rgba(${currentTheme.colors.bgTertiary}, 0.5)`,
        }}
      >
        <MdLanguage className="text-lg" />
        <span className="text-xl">{currentLanguage.flag}</span>
        <span className="text-sm font-medium hidden sm:inline">{currentLanguage.name}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className={`absolute top-full right-0 mt-2 w-56 ${currentTheme.classes.bgPrimary} ${currentTheme.classes.border} border rounded-xl shadow-2xl overflow-hidden z-50`}>
          {languages.map((lang) => {
            const isActive = currentLanguage.code === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center space-x-3 px-4 py-3 transition-colors ${
                  isActive 
                    ? `${currentTheme.classes.bgTertiary} border-l-2`
                    : `${currentTheme.classes.bgTertiaryHover}`
                }`}
                style={isActive ? { borderLeftColor: `rgb(${currentTheme.colors.accentStart})` } : {}}
              >
                  <span className={`text-xl opacity-60 ${currentTheme.classes.textPrimary}`}>{lang.flag}</span>
                  <span className={`text-sm font-medium ${currentTheme.classes.textPrimary}`}>{lang.name}</span>
                  {isActive && (
                    <svg className="w-4 h-4 ml-auto" style={{ color: `rgb(${currentTheme.colors.accentStart})` }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}