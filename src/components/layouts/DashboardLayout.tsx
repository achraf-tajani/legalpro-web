import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { ROUTES } from '../../config/routes.config';
import logoAvocat from '../../assets/images/icon_av.svg';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import ThemeSelector from '../common/ThemeSelector';

import { MdDashboard, MdFolder, MdPeople,MdCheckCircle,MdAttachMoney,MdDescription,MdCalendarToday,MdLogout} from 'react-icons/md';
const navigation = [
  { key: 'dashboard', path: ROUTES.DASHBOARD.HOME, icon: MdDashboard },
  { key: 'dossiers', path: ROUTES.DASHBOARD.DOSSIERS, icon: MdFolder },
  { key: 'clients', path: ROUTES.DASHBOARD.CLIENTS, icon: MdPeople },
  { key: 'taches', path: ROUTES.DASHBOARD.TACHES, icon: MdCheckCircle },
  { key: 'factures', path: ROUTES.DASHBOARD.FACTURES, icon: MdAttachMoney },
  { key: 'documents', path: ROUTES.DASHBOARD.DOCUMENTS, icon: MdDescription },
  { key: 'calendrier', path: ROUTES.DASHBOARD.CALENDRIER, icon: MdCalendarToday },
];

export default function DashboardLayout() {
  const { t } = useTranslation(); 
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

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

  return (
    <div className="flex min-h-screen bg-slate-950">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-slate-900 border-r border-slate-800 transition-all duration-300 z-40 flex flex-col ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-slate-800 flex-shrink-0">
          {sidebarOpen ? (
            <div className="flex items-center space-x-3 px-4">
              <img src={logoAvocat} alt="Logo" className="w-8 h-8" />
              <span className="text-xl font-bold text-white">LegalPro</span>
            </div>
          ) : (
            <img src={logoAvocat} alt="Logo" className="w-8 h-8" />
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <Icon className="text-xl" />
                {sidebarOpen && (
                  <span className="font-medium">{t(`nav.${item.key}`)}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <div className={`flex items-center ${sidebarOpen ? 'space-x-3 mb-3' : 'justify-center mb-3'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-slate-400">
                  {user?.type_utilisateur}
                </p>
              </div>
            )}
          </div>
          
          {/* Bouton déconnexion amélioré */}
          <button
            onClick={handleLogout}
            className={`w-full group relative overflow-hidden bg-slate-800/50 hover:bg-red-500/10 border border-slate-700 hover:border-red-500/50 rounded-xl transition-all duration-200 cursor-pointer ${
              sidebarOpen ? 'px-4 py-2.5' : 'p-2.5'
            }`}
          >
            <div className={`flex items-center ${sidebarOpen ? 'justify-center space-x-2' : 'justify-center'}`}>
              <MdLogout className="text-lg text-slate-400 group-hover:text-red-400 transition-colors" />
              {sidebarOpen && (
                <span className="text-sm font-medium text-slate-400 group-hover:text-red-400 transition-colors">
                  <span>{t('nav.logout')}</span>
                </span>
              )}
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-30">
          <div className="h-full px-6 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <ThemeSelector />
              <LanguageSwitcher variant="minimal" />
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}