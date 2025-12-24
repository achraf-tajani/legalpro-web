import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { ROUTES } from '../../config/routes.config';
import logoAvocat from '../../assets/images/icon_av.svg';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import ThemeSelector from '../common/ThemeSelector';

import { MdDashboard, MdFolder, MdPeople, MdCheckCircle, MdAttachMoney, MdDescription, MdCalendarToday, MdLogout, MdClose, MdRefresh } from 'react-icons/md';
import AvatarDropdown from '../AvatarDropdown';
import PasswordModal from '../PasswordModal';

const navigation = [
  { key: 'dashboard', path: ROUTES.DASHBOARD.HOME, icon: MdDashboard },
  { key: 'dossiers', path: ROUTES.DASHBOARD.DOSSIERS, icon: MdFolder },
  { key: 'clients', path: ROUTES.DASHBOARD.CLIENTS, icon: MdPeople },
  { key: 'taches', path: ROUTES.DASHBOARD.TACHES, icon: MdCheckCircle },
  { key: 'factures', path: ROUTES.DASHBOARD.FACTURES, icon: MdAttachMoney },
  { key: 'documents', path: ROUTES.DASHBOARD.DOCUMENTS, icon: MdDescription },
  { key: 'calendrier', path: ROUTES.DASHBOARD.CALENDRIER, icon: MdCalendarToday },
  { key: 'utilisateurs', path: ROUTES.DASHBOARD.UTILISATEUR, icon: MdPeople, adminOnly: true }
];

export default function DashboardLayout() {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.AUTH.LOGIN);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleMenuToggle = () => {
    if (window.innerWidth >= 1024) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setMobileMenuOpen(!mobileMenuOpen);
    }
  };

  return (
    <div className="flex h-screen bg-theme-primary">
      {/* Backdrop mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar / Drawer */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-50 flex flex-col transition-all duration-300
          bg-theme-secondary border-theme border-r
          
          lg:relative lg:z-40 ${sidebarOpen ? 'lg:w-64' : 'lg:w-20'}
          
          ${mobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div className={`h-16 flex items-center ${mobileMenuOpen || sidebarOpen ? 'justify-between px-4' : 'justify-center'} border-theme border-b flex-shrink-0`}>
          {(sidebarOpen || mobileMenuOpen) ? (
            <div className="flex items-center space-x-3">
              <img src={logoAvocat} alt="Logo" className="w-8 h-8" />
              <span className="text-xl font-bold text-theme-primary">LegalPro</span>
            </div>
          ) : (
            <img src={logoAvocat} alt="Logo" className="w-8 h-8" />
          )}

          {/* Bouton fermer (mobile uniquement) */}
          {mobileMenuOpen && (
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-2 text-theme-muted hover:text-theme-primary transition-colors"
            >
              <MdClose className="text-2xl" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            if (item.key === 'utilisateurs' && user?.type_utilisateur !== 'ADMIN') {
              return null;
            }

            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
                  active
                    ? 'bg-accent-gradient text-white shadow-lg'
                    : 'text-theme-muted hover:bg-theme-tertiary'
                }`}
              >
                <Icon className="text-xl flex-shrink-0" />
                {(sidebarOpen || mobileMenuOpen) && (
                  <span className={`font-medium ${active ? 'text-white' : ''}`}>
                    {t(`nav.${item.key}`)}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="mt-auto p-4 border-theme border-t">
          <div className={`flex items-center ${(sidebarOpen || mobileMenuOpen) ? 'space-x-3 mb-3' : 'justify-center mb-3'}`}>
            <div className="w-10 h-10 bg-accent-gradient rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            {(sidebarOpen || mobileMenuOpen) && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-theme-primary truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-theme-secondary">
                  {user?.type_utilisateur}
                </p>
              </div>
            )}
          </div>

          {/* Bouton déconnexion */}
          <button
            onClick={handleLogout}
            className={`w-full group relative overflow-hidden bg-theme-tertiary hover:bg-red-500/10 border-theme border hover:border-red-500/50 rounded-xl transition-all duration-200 cursor-pointer ${
              (sidebarOpen || mobileMenuOpen) ? 'px-4 py-2.5' : 'p-2.5'
            }`}
          >
            <div className={`flex items-center ${(sidebarOpen || mobileMenuOpen) ? 'justify-center space-x-2' : 'justify-center'}`}>
              <MdLogout className="text-lg text-theme-muted group-hover:text-red-400 transition-colors" />
              {(sidebarOpen || mobileMenuOpen) && (
                <span className="text-sm font-medium text-theme-muted group-hover:text-red-400 transition-colors">
                  {t('nav.logout')}
                </span>
              )}
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col transition-all duration-300">
        {/* Header */}
        <header className="h-16 bg-theme-surface border-theme border-b sticky top-0 z-30">
          <div className="h-full px-4 sm:px-6 flex items-center justify-between">
            <button
              onClick={handleMenuToggle}
              className="p-2 rounded-lg transition-colors text-theme-muted hover:text-theme-primary"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Bouton Refresh - visible uniquement en PWA */}
                  {window.matchMedia('(display-mode: standalone)').matches && (
                    <button
                      onClick={() => window.location.reload()}
                      className="p-2 rounded-lg transition-colors text-theme-muted hover:text-theme-primary hover:bg-theme-tertiary"
                      title="Actualiser"
                    >
                      <MdRefresh className="text-xl" />
                    </button>
                  )}
              <ThemeSelector />
              <LanguageSwitcher variant="minimal" />
              <AvatarDropdown onChangePassword={() => setShowPasswordModal(true)} />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Modal - En dehors de tout */}
      <PasswordModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)} 
      />
    </div>
  );
}