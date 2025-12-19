import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../stores/authStore';
import { MdLock } from 'react-icons/md';

interface AvatarDropdownProps {
  onChangePassword: () => void;
}

export default function AvatarDropdown({ onChangePassword }: AvatarDropdownProps) {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer w-8 h-8 sm:w-9 sm:h-9 bg-accent-gradient rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm hover:opacity-90 transition-opacity"
      >
        {user?.email?.charAt(0).toUpperCase() || 'A'}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-theme-secondary border-theme border rounded-xl shadow-2xl overflow-hidden z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-theme border-b">
            <p className="text-sm font-medium text-theme-primary">
              {user?.email}
            </p>
            <p className="text-xs text-theme-muted">
              {user?.type_utilisateur}
            </p>
          </div>

          {/* Change Password */}
          <button
            onClick={() => {
              onChangePassword();
              setIsOpen(false);
            }}
            className="cursor-pointer w-full flex items-center space-x-3 px-4 py-3 transition-colors hover:bg-theme-tertiary"
          >
            <MdLock className="text-lg text-theme-muted" />
            <span className="text-sm font-medium text-theme-primary">
              Modifier mot de passe
            </span>
          </button>
        </div>
      )}
    </div>
  );
}