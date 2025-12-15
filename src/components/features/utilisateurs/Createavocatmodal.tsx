import { useState } from 'react';
import { MdClose, MdPerson, MdContentCopy, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { utilisateurService} from '../../../services/utilisateur.service';
import type { CreateAvocatDto } from '../../../types/utilisateur.types';

interface CreateAvocatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateAvocatModal({ isOpen, onClose, onSuccess }: CreateAvocatModalProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isCreating, setIsCreating] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');

  const [formData, setFormData] = useState<CreateAvocatDto>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    numero_barreau: '',
    specialite: '',
    tarif_horaire: undefined,
    type_utilisateur: 'AVOCAT',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const result = await utilisateurService.createAvocat(formData);
      setGeneratedPassword(result.temporaryPassword);
      setStep('success');
    } catch (error) {
      console.error('Erreur création:', error);
      alert('Erreur lors de la création');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setStep('form');
      setGeneratedPassword('');
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        numero_barreau: '',
        specialite: '',
        tarif_horaire: undefined,
        type_utilisateur: 'AVOCAT',
      });
    }, 300);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copié !');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
      <div 
        className="bg-theme-secondary rounded-none sm:rounded-2xl shadow-2xl w-full h-full sm:h-auto sm:max-w-2xl sm:max-h-[90vh] border-theme border flex flex-col overflow-hidden"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 sm:p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MdPerson className="text-2xl sm:text-3xl text-white" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">Créer un compte avocat</h2>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white">
              <MdClose className="text-xl sm:text-2xl" />
            </button>
          </div>
        </div>

        {step === 'form' ? (
          <>
            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              
              {/* Nom & Prénom */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-theme-secondary mb-2">Nom *</label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-theme-secondary mb-2">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0"
                  />
                </div>
              </div>

              {/* Email & Téléphone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-theme-secondary mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-theme-secondary mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0"
                  />
                </div>
              </div>

              {/* Numéro Barreau & Spécialité */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-theme-secondary mb-2">N° Barreau *</label>
                  <input
                    type="text"
                    required
                    value={formData.numero_barreau}
                    onChange={(e) => setFormData({ ...formData, numero_barreau: e.target.value })}
                    className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-theme-secondary mb-2">Spécialité</label>
                  <input
                    type="text"
                    value={formData.specialite}
                    onChange={(e) => setFormData({ ...formData, specialite: e.target.value })}
                    className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0"
                  />
                </div>
              </div>

              {/* Tarif */}
              <div>
                <label className="block text-sm font-medium text-theme-secondary mb-2">Tarif horaire (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.tarif_horaire || ''}
                  onChange={(e) => setFormData({ ...formData, tarif_horaire: parseFloat(e.target.value) || undefined })}
                  className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0"
                />
              </div>

              {/* Rôle */}
              <div>
                <label className="block text-sm font-medium text-theme-secondary mb-2">Rôle *</label>
                <select
                  required
                  value={formData.type_utilisateur}
                  onChange={(e) => setFormData({ ...formData, type_utilisateur: e.target.value as 'ADMIN' | 'AVOCAT' })}
                  className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0"
                >
                  <option value="avocat">Avocat</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              {/* Info MDP */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <p className="text-sm text-blue-400">
                  ℹ️ Un mot de passe temporaire sera généré automatiquement et envoyé par email.
                </p>
              </div>
            </form>

            {/* Footer */}
            <div className="p-4 sm:p-6 bg-theme-tertiary border-theme border-t flex flex-col-reverse sm:flex-row justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={handleClose}
                disabled={isCreating}
                className="w-full sm:w-auto px-6 py-3 border-theme border rounded-xl text-theme-secondary font-semibold hover:bg-theme-tertiary transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={isCreating}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50"
              >
                {isCreating ? 'Création...' : 'Créer le compte'}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Success Screen */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-theme-primary mb-2">Compte créé avec succès !</h3>
                <p className="text-theme-secondary">Les identifiants ont été générés</p>
              </div>

              <div className="space-y-4">
                <div className="bg-theme-surface border-theme border rounded-xl p-4">
                  <label className="block text-sm font-semibold text-theme-secondary mb-2">Email</label>
                  <div className="flex items-center justify-between">
                    <p className="text-theme-primary font-mono">{formData.email}</p>
                    <button
                      onClick={() => copyToClipboard(formData.email)}
                      className="p-2 hover:bg-theme-tertiary rounded-lg transition-colors"
                    >
                      <MdContentCopy className="text-theme-muted" />
                    </button>
                  </div>
                </div>

                <div className="bg-theme-surface border-theme border rounded-xl p-4">
                  <label className="block text-sm font-semibold text-theme-secondary mb-2">Mot de passe temporaire</label>
                  <div className="flex items-center justify-between">
                    <p className="text-theme-primary font-mono">
                      {showPassword ? generatedPassword : '••••••••••••'}
                    </p>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-2 hover:bg-theme-tertiary rounded-lg transition-colors"
                      >
                        {showPassword ? <MdVisibilityOff className="text-theme-muted" /> : <MdVisibility className="text-theme-muted" />}
                      </button>
                      <button
                        onClick={() => copyToClipboard(generatedPassword)}
                        className="p-2 hover:bg-theme-tertiary rounded-lg transition-colors"
                      >
                        <MdContentCopy className="text-theme-muted" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                  <p className="text-sm text-yellow-400">
                    ⚠️ Envoyez ces identifiants à l'utilisateur de manière sécurisée. Il pourra modifier son mot de passe après sa première connexion.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 bg-theme-tertiary border-theme border-t flex justify-end flex-shrink-0">
              <button
                onClick={() => {
                  onSuccess();
                  handleClose();
                }}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg transition-all"
              >
                Terminé
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}