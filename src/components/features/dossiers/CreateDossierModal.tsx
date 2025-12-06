import { useState } from 'react';
import { MdClose } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import type { CreateDossierDto } from '../../../types/dossier.types';

interface CreateDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDossierDto) => Promise<void>;
  clients: Array<{ id: string; nom: string; prenom?: string }>;
}

export default function CreateDossierModal({ isOpen, onClose, onSubmit, clients }: CreateDossierModalProps) {
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
    confidentialite: '',
    id_client: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
      onClose();
      // Reset form
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
        confidentialite: '',
        id_client: '',
      });
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
    <div 
      className="bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-slate-800"
      dir={isRTL ? 'rtl' : 'ltr'}
    >        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">{t('dossiers.new')}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Titre */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('dossiers.modal.title')} *
              </label>
              <input
                type="text"
                required
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder={t('dossiers.modal.titlePlaceholder')}
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('dossiers.modal.type')} *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('dossiers.modal.client')}
              </label>
              <select
                value={formData.id_client}
                onChange={(e) => setFormData({ ...formData, id_client: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
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
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('dossiers.modal.statut')}
              </label>
              <select
                value={formData.statut}
                onChange={(e) => setFormData({ ...formData, statut: e.target.value as any })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="ouvert">{t('dossiers.modal.statutOuvert')}</option>
                <option value="en_cours">{t('dossiers.modal.statutEnCours')}</option>
                <option value="suspendu">{t('dossiers.modal.statutSuspendu')}</option>
                <option value="clos"> {t('dossiers.modal.statutClos')}</option>
                <option value="archive">{t('dossiers.modal.statutArchive')}</option>
              </select>
            </div>

            {/* Priorité */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('dossiers.modal.priorite')}
              </label>
              <select
                value={formData.priorite}
                onChange={(e) => setFormData({ ...formData, priorite: e.target.value as any })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="basse">{t('dossiers.modal.prioriteBasse')}</option>
                <option value="normale">{t('dossiers.modal.prioriteNormale')}</option>
                <option value="haute">{t('dossiers.modal.prioriteHaute')}</option>
                <option value="critique"> {t('dossiers.modal.prioriteCritique')}</option>
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('dossiers.modal.description')}
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder={t('dossiers.modal.descriptionPlaceholder')}
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-6 bg-slate-800/50 border-t border-slate-700 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-3 border border-slate-600 rounded-xl text-slate-300 font-semibold hover:bg-slate-700 transition-all disabled:opacity-50"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50 flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>{t('common.loading')}</span>
              </>
            ) : (
              <span>{t('common.save')}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}