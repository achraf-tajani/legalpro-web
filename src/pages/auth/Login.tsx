import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { ROUTES } from '../../config/routes.config';
import logoAvocat from '../../assets/images/icon_av.svg';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';
import ThemeSelector from '../../components/common/ThemeSelector';

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('admin@legalpro.com');
  const [password, setPassword] = useState('Test123!');
  
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD.HOME);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      navigate(ROUTES.DASHBOARD.HOME);
    } catch (err) {
      // Erreur gérée dans le store
    }
  };

  return (
    <div className="min-h-screen flex bg-theme-primary relative overflow-hidden">
      {/* Theme + Language Switcher */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-50 flex items-center space-x-3">
        <ThemeSelector />
        <LanguageSwitcher />
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 opacity-5 rounded-full blur-3xl" 
             style={{ background: 'linear-gradient(to bottom right, rgb(var(--color-accentStart)), transparent)' }}>
        </div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 opacity-5 rounded-full blur-3xl"
             style={{ background: 'linear-gradient(to top right, rgb(var(--color-accentEnd)), transparent)' }}>
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10" 
             style={{ 
               backgroundImage: 'linear-gradient(to right, rgba(var(--color-border), 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(var(--color-border), 0.3) 1px, transparent 1px)',
               backgroundSize: '4rem 4rem' 
             }}>
        </div>
      </div>

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        <div className="relative z-10 max-w-lg">
          {/* Logo */}
          <div className="mb-12 transform hover:scale-105 transition-transform duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-accent-gradient rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative bg-theme-surface rounded-3xl p-8 border-theme border">
                <img 
                  src={logoAvocat} 
                  alt="LegalPro" 
                  className="w-32 h-32 sm:w-48 sm:h-48 mx-auto object-contain"
                />
              </div>
            </div>
          </div>

          {/* Titre avec gradient */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl sm:text-6xl font-bold title-gradient">
              {t('auth.title')}
            </h1>
            <p className="text-lg sm:text-xl text-theme-secondary leading-relaxed">
              {t('auth.subtitle')}
            </p>
          </div>

          {/* Features */}
          <div className="mt-12 sm:mt-16 space-y-4 sm:space-y-6">
            {[
              { icon: '⚡', text: 'Gestion optimisée des dossiers' },
              { icon: '🔒', text: 'Sécurité et confidentialité maximales' },
              { icon: '📊', text: 'Analytics et rapports avancés' },
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="flex items-center space-x-4 text-theme-secondary group transition-colors"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-theme-surface rounded-xl flex items-center justify-center border-theme border transition-colors">
                  <span className="text-xl sm:text-2xl">{feature.icon}</span>
                </div>
                <span className="text-base sm:text-lg">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-theme-surface rounded-2xl mb-4 border-theme border">
              <img 
                src={logoAvocat} 
                alt="LegalPro" 
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-theme-primary">
              {t('auth.title')}
            </h1>
          </div>

          {/* Card de connexion */}
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-accent-gradient rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            
            {/* Card */}
            <div className="relative bg-theme-surface rounded-2xl p-6 sm:p-8 border-theme border shadow-2xl">
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-theme-primary mb-2">
                  {t('auth.login')}
                </h2>
                <p className="text-theme-secondary text-sm">
                  {t('auth.subtitle')}
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start backdrop-blur-sm">
                  <svg className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-red-400 text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-theme-secondary">
                    {t('auth.email')}
                  </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      required
                      disabled={isLoading}
                      className="w-full px-4 py-3 sm:py-3.5 bg-theme-tertiary border-theme border rounded-xl text-theme-primary placeholder-opacity-50 focus:ring-2 focus:ring-offset-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="avocat@exemple.fr"
                    />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-theme-secondary">
                    {t('auth.password')}
                  </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 sm:py-3.5 bg-theme-tertiary border-theme border rounded-xl text-theme-primary placeholder-opacity-50 focus:ring-2 focus:ring-offset-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full group mt-6 sm:mt-8"
                >
                  <div className="absolute -inset-0.5 bg-accent-gradient rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-200"></div>
                  <div className="relative flex items-center justify-center px-6 py-3 sm:py-4 bg-accent-gradient hover:bg-accent-gradient-hover rounded-xl text-white font-semibold transform group-hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-3"></div>
                        <span>{t('auth.loading')}</span>
                      </>
                    ) : (
                      <>
                        <span>{t('auth.submit')}</span>
                        <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </div>
                </button>
              </form>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center mt-6 sm:mt-8 text-theme-muted text-xs sm:text-sm">
            {t('auth.footer')}
          </p>
        </div>
      </div>
    </div>
  );
}