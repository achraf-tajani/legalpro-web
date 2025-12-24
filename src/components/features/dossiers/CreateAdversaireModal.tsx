import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MdClose, MdPerson } from 'react-icons/md';
import type { Adversaire, CreateAdversaireDto, UpdateAdversaireDto } from '../../../types/adversaire.types';
import { showSuccessAlert, showErrorAlert } from '../../../utils/alerts';

interface CreateAdversaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAdversaireDto) => Promise<void>;
  onUpdate?: (id: string, data: UpdateAdversaireDto) => Promise<void>;
  dossierId: string;
  adversaire?: Adversaire | null;
  mode?: 'create' | 'edit';
}

export default function CreateAdversaireModal({
  isOpen,
  onClose,
  onSubmit,
  onUpdate,
  dossierId,
  adversaire,
  mode = 'create'
}: CreateAdversaireModalProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    nom: '',
    type_adversaire: 'personne_physique',
    email: '',
    telephone: '',
    avocat_adverse: '',
    cabinet: '',
    fonction: '',
    adresse: '',
    strategie_known: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && adversaire) {
        setFormData({
          nom: adversaire.nom || '',
          type_adversaire: adversaire.type_adversaire || 'personne_physique',
          email: adversaire.email || '',
          telephone: adversaire.telephone || '',
          avocat_adverse: adversaire.avocat_adverse || '',
          cabinet: adversaire.cabinet || '',
          fonction: adversaire.fonction || '',
          adresse: adversaire.adresse || '',
          strategie_known: adversaire.strategie_known || '',
        });
      } else {
        setFormData({
          nom: '',
          type_adversaire: 'personne_physique',
          email: '',
          telephone: '',
          avocat_adverse: '',
          cabinet: '',
          fonction: '',
          adresse: '',
          strategie_known: '',
        });
      }
    }
  }, [isOpen, mode, adversaire]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nom.trim()) {
      await showErrorAlert(
        t('adversaires.modal.nomRequired'),
        t('adversaires.modal.nomRequiredMessage')
      );
      return;
    }

    try {
      setIsSaving(true);
      const cleanedData = {
        nom: formData.nom,
        type_adversaire: formData.type_adversaire || null,
        email: formData.email || null,
        telephone: formData.telephone || null,
        avocat_adverse: formData.avocat_adverse || null,
        cabinet: formData.cabinet || null,
        fonction: formData.fonction || null,
        adresse: formData.adresse || null,
        strategie_known: formData.strategie_known || null,
      };
      console.log(cleanedData)
      if (mode === 'edit' && adversaire && onUpdate) {
        await onUpdate(adversaire.id, cleanedData);
        await showSuccessAlert(
          t('adversaires.success.updated'),
          t('adversaires.success.updatedMessage')
        );
      } else {
        await onSubmit({
          id_dossier: dossierId,
          ...cleanedData,
        });
        await showSuccessAlert(
          t('adversaires.success.created'),
          t('adversaires.success.createdMessage')
        );
      }

      onClose();
    } catch (error: any) {
      console.error('Erreur:', error);
      const errorMessage = error?.response?.data?.message ||
                          error?.message ||
                          t('adversaires.error.save');

      await showErrorAlert(
        mode === 'edit' ? t('adversaires.error.update') : t('adversaires.error.create'),
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
        className="bg-theme-secondary rounded-none sm:rounded-2xl shadow-2xl w-full h-full sm:h-auto sm:max-w-2xl sm:max-h-[90vh] border-theme border flex flex-col overflow-hidden"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-theme border-b flex-shrink-0 bg-gradient-to-r from-red-500 to-rose-600">
          <div className="flex items-center space-x-3">
            <MdPerson className="text-white text-xl sm:text-2xl" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {mode === 'edit' ? t('adversaires.update') : t('adversaires.new')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <MdClose className="text-xl sm:text-2xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nom */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-theme-secondary mb-2">
                {t('adversaires.modal.nom')} *
              </label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0 transition-all"
                placeholder={t('adversaires.modal.nomPlaceholder')}
                required
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-2">
                {t('adversaires.modal.type')}
              </label>
              <select
                value={formData.type_adversaire}
                onChange={(e) => setFormData({ ...formData, type_adversaire: e.target.value })}
                className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0 transition-all"
              >
                <option value="personne_physique">{t('adversaires.modal.personnePhysique')}</option>
                <option value="entreprise">{t('adversaires.modal.entreprise')}</option>
                <option value="association">{t('adversaires.modal.association')}</option>
                <option value="administration">{t('adversaires.modal.administration')}</option>
              </select>
            </div>

            {/* Fonction */}
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-2">
                {t('adversaires.modal.fonction')}
              </label>
              <input
                type="text"
                value={formData.fonction}
                onChange={(e) => setFormData({ ...formData, fonction: e.target.value })}
                className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0 transition-all"
                placeholder={t('adversaires.modal.fonctionPlaceholder')}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-2">
                {t('adversaires.modal.email')}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0 transition-all"
                placeholder={t('adversaires.modal.emailPlaceholder')}
              />
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-2">
                {t('adversaires.modal.telephone')}
              </label>
              <input
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0 transition-all"
                placeholder={t('adversaires.modal.telephonePlaceholder')}
              />
            </div>

            {/* Avocat adverse */}
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-2">
                {t('adversaires.modal.avocatAdverse')}
              </label>
              <input
                type="text"
                value={formData.avocat_adverse}
                onChange={(e) => setFormData({ ...formData, avocat_adverse: e.target.value })}
                className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0 transition-all"
                placeholder={t('adversaires.modal.avocatAdversePlaceholder')}
              />
            </div>

            {/* Cabinet */}
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-2">
                {t('adversaires.modal.cabinet')}
              </label>
              <input
                type="text"
                value={formData.cabinet}
                onChange={(e) => setFormData({ ...formData, cabinet: e.target.value })}
                className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0 transition-all"
                placeholder={t('adversaires.modal.cabinetPlaceholder')}
              />
            </div>

            {/* Adresse */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-theme-secondary mb-2">
                {t('adversaires.modal.adresse')}
              </label>
              <input
                type="text"
                value={formData.adresse}
                onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0 transition-all"
                placeholder={t('adversaires.modal.adressePlaceholder')}
              />
            </div>

            {/* Stratégie connue */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-theme-secondary mb-2">
                {t('adversaires.modal.strategie')}
              </label>
              <textarea
                value={formData.strategie_known}
                onChange={(e) => setFormData({ ...formData, strategie_known: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0 transition-all resize-none"
                placeholder={t('adversaires.modal.strategiePlaceholder')}
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 p-4 sm:p-6 border-theme border-t bg-theme-tertiary flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 bg-gray-500/20 hover:bg-gray-500/30 text-theme-secondary border-theme border rounded-xl font-semibold transition-all"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSaving}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-lg transition-all"
          >
            {isSaving ? t('common.saving') : (mode === 'edit' ? t('common.update') : t('common.create'))}
          </button>
        </div>
      </div>
    </div>
  );
}