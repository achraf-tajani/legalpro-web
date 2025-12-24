import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdClose, MdCheck, MdLock } from 'react-icons/md';
import { authService } from '../services/auth.service';
import { showSuccessAlert, showErrorAlert } from '../utils/alerts';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PasswordModal({ isOpen, onClose }: PasswordModalProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      await showErrorAlert(
        t('password.error.mismatch'),
        t('password.error.mismatchMessage')
      );
      return;
    }

    if (newPassword.length < 8) {
      await showErrorAlert(
        t('password.error.tooShort'),
        t('password.error.tooShortMessage')
      );
      return;
    }

    setIsSaving(true);
    try {
      await authService.changePassword(oldPassword, newPassword);
      await showSuccessAlert(
        t('password.success.changed'),
        t('password.success.changedMessage')
      );
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }, 2000);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message ||
                          t('password.error.currentIncorrect');
      await showErrorAlert(
        t('password.error.changeError'),
        errorMessage
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
      <div 
        className="bg-theme-secondary rounded-2xl shadow-2xl w-full max-w-md border-theme border flex flex-col overflow-hidden"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-theme border-b flex-shrink-0 bg-accent-gradient">
          <div className="flex items-center space-x-3">
            <MdLock className="text-white text-xl sm:text-2xl" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {t('password.title')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <MdClose className="text-xl sm:text-2xl" />
          </button>
        </div>

        {success ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <MdCheck className="text-4xl text-green-500" />
            </div>
            <p className="text-theme-primary text-lg font-medium">{t('password.success.updated')}</p>
          </div>
        ) : (
          <>
            {/* Form - Scrollable */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Mot de passe actuel */}
              <div>
                <label className="block text-sm font-medium text-theme-secondary mb-2">
                  {t('password.currentPassword')} *
                </label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary placeholder-opacity-50 focus:ring-2 focus:ring-offset-0 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Nouveau mot de passe */}
              <div>
                <label className="block text-sm font-medium text-theme-secondary mb-2">
                  {t('password.newPassword')} *
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary placeholder-opacity-50 focus:ring-2 focus:ring-offset-0 transition-all"
                  placeholder="••••••••"
                  required
                />
                <p className="text-xs text-theme-muted mt-1">{t('password.minLength')}</p>
              </div>

              {/* Confirmer mot de passe */}
              <div>
                <label className="block text-sm font-medium text-theme-secondary mb-2">
                  {t('password.confirmPassword')} *
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary placeholder-opacity-50 focus:ring-2 focus:ring-offset-0 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </form>

            {/* Footer - Fixed */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 p-4 sm:p-6 border-theme border-t bg-theme-tertiary flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 bg-theme-tertiary hover:bg-opacity-80 text-theme-secondary border-theme border rounded-xl font-semibold transition-all"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSaving}
                className="w-full sm:w-auto px-6 py-3 bg-accent-gradient hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-lg transition-all"
              >
                {isSaving ? t('common.saving') : t('password.confirm')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}