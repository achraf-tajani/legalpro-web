import { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import type { CreateDossierDto, UpdateDossierDto, Dossier } from '../../../types/dossier.types';
import { showSuccessAlert, showErrorAlert } from '../../../utils/alerts';

interface CreateDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDossierDto) => Promise<void>;
  onUpdate?: (id: string, data: UpdateDossierDto) => Promise<void>;
  clients: Array<{ id: string; nom: string; prenom?: string }>;
  dossier?: Dossier | null;
  mode?: 'create' | 'edit';
}

export default function CreateDossierModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  onUpdate,
  clients,
  dossier = null,
  mode = 'create'
}: CreateDossierModalProps) {
  
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateDossierDto>({
    titre: '',
    description: '',
    type: '',
    domaine: '',
    statut: 'ouvert',
    priorite: 'normale',
    montant_en_jeu: undefined,
    tribunal: '',
    reference: '',
    confidentialite: 'confidentiel',
    id_client: '',
  });

  useEffect(() => {
    if (dossier && mode === 'edit') {
      setFormData({
        titre: dossier.titre,
        description: dossier.description || '',
        type: dossier.type,
        domaine: dossier.domaine || '',
        statut: dossier.statut,
        priorite: dossier.priorite,
        montant_en_jeu: dossier.montant_en_jeu || undefined,
        tribunal: dossier.tribunal || '',
        reference: dossier.reference || '',
        confidentialite: dossier.confidentialite || '',
        id_client: dossier.id_client || '',
      });
    } else {
      setFormData({
        titre: '',
        description: '',
        type: '',
        domaine: '',
        statut: 'ouvert',
        priorite: 'normale',
        montant_en_jeu: undefined,
        tribunal: '',
        reference: '',
        confidentialite: 'confidentiel',
        id_client: '',
      });
    }
  }, [dossier, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation côté client
    if (!formData.id_client) {
      await showErrorAlert(
        t('dossiers.error.createTitle') || 'Erreur de création',
        t('dossiers.error.clientRequired') || 'Veuillez sélectionner un client'
      );
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'edit' && dossier && onUpdate) {
        await onUpdate(dossier.id, formData);
        await showSuccessAlert(
          t('dossiers.success.updated') || 'Dossier modifié',
          t('dossiers.success.updatedMessage') || 'Le dossier a été modifié avec succès'
        );
      } else {
        await onSubmit(formData);
        await showSuccessAlert(
          t('dossiers.success.created') || 'Dossier créé',
          t('dossiers.success.createdMessage') || 'Le dossier a été créé avec succès'
        );
      }
      onClose();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);

      // Extraire le message d'erreur
      let errorMessage = t('dossiers.error.generic') || 'Une erreur est survenue';

      if (error?.response?.data?.message) {
        const apiMessage = error.response.data.message;
        // Personnaliser les messages d'erreur de l'API
        if (Array.isArray(apiMessage)) {
          errorMessage = apiMessage.join(', ');
        } else if (typeof apiMessage === 'string') {
          // Traduire les erreurs communes
          if (apiMessage.includes('id_client') || apiMessage.includes('client')) {
            errorMessage = t('dossiers.error.clientRequired') || 'Veuillez sélectionner un client';
          } else {
            errorMessage = apiMessage;
          }
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      await showErrorAlert(
        mode === 'edit'
          ? (t('dossiers.error.updateTitle') || 'Erreur de modification')
          : (t('dossiers.error.createTitle') || 'Erreur de création'),
        errorMessage
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
      <div 
        className="bg-theme-secondary rounded-none sm:rounded-2xl shadow-2xl w-full h-full sm:h-auto sm:max-w-2xl sm:max-h-[90vh] overflow-hidden border-theme border flex flex-col"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-accent-gradient p-4 sm:p-6 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            {mode === 'edit' ? t('dossiers.update') : t('dossiers.new')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
          >
            <MdClose className="text-xl sm:text-2xl" />
          </button>
        </div>

        {/* Form - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Titre */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-theme-label mb-2">
                {t('dossiers.modal.title')} *
              </label>
                <input
                  type="text"
                  required
                  value={formData.titre || ''}
                  onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                  className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary placeholder-opacity-50 focus:ring-2 focus:ring-offset-0 transition-all"
                  placeholder={t('dossiers.modal.titlePlaceholder')}
                />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-theme-label mb-2">
                {t('dossiers.modal.type')} *
              </label>
              <select
                required
                value={formData.type || ''}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0 transition-all"
              >
                <option value="">{t('dossiers.modal.selectType')}</option>
                <option value="Civil">{t('dossiers.modal.typeCivil')}</option>
                <option value="Pénal">{t('dossiers.modal.typePenal')}</option>
                <option value="Commercial">{t('dossiers.modal.typeCommercial')}</option>
                <option value="Administratif">{t('dossiers.modal.typeAdministratif')}</option>
              </select>
            </div>

            {/* Client */}
            <div>
              <label className="block text-sm font-medium text-theme-label mb-2">
                {t('dossiers.modal.client')} *
              </label>
              <select
                required
                value={formData.id_client || ''}
                onChange={(e) => setFormData({ ...formData, id_client: e.target.value })}
                className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0 transition-all"
              >
                <option value="">{t('dossiers.modal.noClient')}</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.nom} {client.prenom || ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-theme-label mb-2">
                {t('dossiers.modal.statut')}
              </label>
              <select
                value={formData.statut}
                onChange={(e) => setFormData({ ...formData, statut: e.target.value as any })}
                className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0 transition-all"
              >
                <option value="ouvert">{t('dossiers.modal.statutOuvert')}</option>
                <option value="en_cours">{t('dossiers.modal.statutEnCours')}</option>
                <option value="suspendu">{t('dossiers.modal.statutSuspendu')}</option>
                <option value="clos">{t('dossiers.modal.statutClos')}</option>
                <option value="archive">{t('dossiers.modal.statutArchive')}</option>
              </select>
            </div>

            {/* Priorité */}
            <div>
              <label className="block text-sm font-medium text-theme-label mb-2">
                {t('dossiers.modal.priorite')}
              </label>
              <select
                value={formData.priorite}
                onChange={(e) => setFormData({ ...formData, priorite: e.target.value as any })}
                className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0 transition-all"
              >
                <option value="basse">{t('dossiers.modal.prioriteBasse')}</option>
                <option value="normale">{t('dossiers.modal.prioriteNormale')}</option>
                <option value="haute">{t('dossiers.modal.prioriteHaute')}</option>
                <option value="critique">{t('dossiers.modal.prioriteCritique')}</option>
              </select>
            </div>

            {/* Domaine */}
            <div>
              <label className="block text-sm font-medium text-theme-label mb-2">
                {t('dossiers.modal.domaine')}
              </label>
              <input
                type="text"
                value={formData.domaine || ''}
                onChange={(e) => setFormData({ ...formData, domaine: e.target.value })}
                className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary placeholder-opacity-50 focus:ring-2 focus:ring-offset-0 transition-all"
                placeholder={t('dossiers.modal.domainePlaceholder')}
              />
            </div>

            {/* Montant en jeu */}
            <div>
              <label className="block text-sm font-medium text-theme-label mb-2">
                {t('dossiers.modal.montantEnJeu')}
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.montant_en_jeu || ''}
                onChange={(e) => setFormData({ ...formData, montant_en_jeu: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary placeholder-opacity-50 focus:ring-2 focus:ring-offset-0 transition-all"
                placeholder={t('dossiers.modal.montantEnJeuPlaceholder')}
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-theme-label mb-2">
                {t('dossiers.modal.description')}
              </label>
              <textarea
                rows={4}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary placeholder-opacity-50 focus:ring-2 focus:ring-offset-0 transition-all resize-none"
                placeholder={t('dossiers.modal.descriptionPlaceholder')}
              />
            </div>
          </div>
        </form>

        {/* Footer - Fixed */}
        <div className="p-4 sm:p-6 bg-theme-tertiary border-theme border-t flex flex-col-reverse sm:flex-row justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="cursor-pointer w-full sm:w-auto px-6 py-3 bg-theme-secondary border-theme border rounded-xl text-theme-secondary font-semibold hover:bg-theme-tertiary transition-all disabled:opacity-50"          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="cursor-pointer w-full sm:w-auto px-6 py-3 bg-accent-gradient hover:bg-accent-gradient-hover text-white rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>{t('common.loading')}</span>
              </>
            ) : (
              <span>{mode === 'edit' ? t('common.update') : t('common.save')}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}