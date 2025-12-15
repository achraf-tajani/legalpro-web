import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MdClose } from 'react-icons/md';
import type { Tache, CreateTacheDto, UpdateTacheDto } from '../../../types/tache.types';

interface CreateTacheModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTacheDto) => Promise<void>;
  onUpdate?: (id: string, data: UpdateTacheDto) => Promise<void>;
  dossierId?: string;
  dossiers?: Array<{id: string; titre: string}>;
  tache?: Tache | null;
  mode?: 'create' | 'edit';
}

export default function CreateTacheModal({
  isOpen,
  onClose,
  onSubmit,
  onUpdate,
  dossierId,
  dossiers,
  tache,
  mode = 'create'
}: CreateTacheModalProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const [selectedDossierId, setSelectedDossierId] = useState(dossierId || '');
  const [formData, setFormData] = useState<CreateTacheDto>({
    id_dossier: selectedDossierId,
    titre: '',
    description: '',
    priorite: 'normal',
    statut: 'not_started',
    date_echeance: '',
    progression: 0,
  });

  const [isSaving, setIsSaving] = useState(false);

  // Reset ou remplir le formulaire
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && tache) {
        setFormData({
          id_dossier: tache.id_dossier,
          titre: tache.titre,
          description: tache.description || '',
          priorite: tache.priorite,
          statut: tache.statut,
          date_echeance: tache.date_echeance || '',
          progression: tache.progression,
          tags: tache.tags || '',
        });
        setSelectedDossierId(tache.id_dossier);
      } else {
        setFormData({
          id_dossier: selectedDossierId,
          titre: '',
          description: '',
          priorite: 'normal',
          statut: 'not_started',
          date_echeance: '',
          progression: 0,
        });
      }
    }else{
        if (!dossierId) {
            setSelectedDossierId('');
        }
    }
    
  }, [isOpen, mode, tache, selectedDossierId]);

  // Synchroniser selectedDossierId avec formData
  useEffect(() => {
    setFormData(prev => ({ ...prev, id_dossier: selectedDossierId }));
  }, [selectedDossierId]);

  // Auto-sélectionner le dossier si passé en prop
  useEffect(() => {
    if (dossierId) {
      setSelectedDossierId(dossierId);
    }
  }, [dossierId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titre.trim()) {
      alert(t('taches.titre') + ' requis');
      return;
    }

    if (!selectedDossierId) {
      alert(t('factures.create.errorNoDossier'));
      return;
    }

    try {
      setIsSaving(true);

      const dataToSubmit = {
        ...formData,
        id_dossier: selectedDossierId,
      };

      if (mode === 'edit' && tache && onUpdate) {
        await onUpdate(tache.id, dataToSubmit);
      } else {
        await onSubmit(dataToSubmit);
      }

      onClose();
    } catch (error) {
      console.error('Erreur:', error);
      alert(t('common.error'));
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
        <div className="flex items-center justify-between p-4 sm:p-6 border-theme border-b flex-shrink-0 bg-gradient-to-r from-blue-500 to-cyan-600">
           <h2 className="text-xl sm:text-2xl font-bold text-white">
            {mode === 'edit' ? t('taches.edit.title') : t('taches.create.title')}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <MdClose className="text-xl sm:text-2xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Sélecteur de dossier (si plusieurs dossiers disponibles) */}
          {!dossierId && dossiers && dossiers.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-2">
                {t('procedures.modal.dossier')} *
              </label>
              <select
                value={selectedDossierId}
                onChange={(e) => setSelectedDossierId(e.target.value)}
                className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0 transition-all"
                required
              >
                <option value="">-- Sélectionner un dossier --</option>
                {dossiers.map(d => (
                  <option key={d.id} value={d.id}>{d.titre}</option>
                ))}
              </select>
            </div>
          )}

          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-2">
              {t('taches.titre')} *
            </label>
            <input
              type="text"
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary placeholder-opacity-50 focus:ring-2 focus:ring-offset-0 transition-all"
              placeholder={t('taches.titre')}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-2">
              {t('taches.description')}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary placeholder-opacity-50 focus:ring-2 focus:ring-offset-0 transition-all resize-none"
              placeholder={t('taches.description')}
            />
          </div>

          {/* Priorité et Statut */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-2">
                {t('taches.priorite')}
              </label>
              <select
                value={formData.priorite}
                onChange={(e) => setFormData({ ...formData, priorite: e.target.value as any })}
                className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0 transition-all"
              >
                <option value="low">{t('taches.priorite.low')}</option>
                <option value="normal">{t('taches.priorite.normal')}</option>
                <option value="high">{t('taches.priorite.high')}</option>
                <option value="critical">{t('taches.priorite.critical')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-2">
                {t('taches.statut')}
              </label>
              <select
                value={formData.statut}
                onChange={(e) => setFormData({ ...formData, statut: e.target.value as any })}
                className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0 transition-all"
              >
                <option value="not_started">{t('taches.statut.not_started')}</option>
                <option value="in_progress">{t('taches.statut.in_progress')}</option>
                <option value="pending">{t('taches.statut.pending')}</option>
                <option value="completed">{t('taches.statut.completed')}</option>
                <option value="cancelled">{t('taches.statut.cancelled')}</option>
              </select>
            </div>
          </div>

          {/* Date échéance et Progression */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-2">
                {t('taches.dateEcheance')}
              </label>
              <input
                type="date"
                value={formData.date_echeance}
                onChange={(e) => setFormData({ ...formData, date_echeance: e.target.value })}
                className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-theme-secondary mb-2">
                {t('taches.progression')} ({formData.progression}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={formData.progression}
                onChange={(e) => setFormData({ ...formData, progression: parseInt(e.target.value) })}
                className="w-full h-2 bg-theme-tertiary rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-2">
              {t('taches.tags')}
            </label>
            <input
              type="text"
              value={formData.tags || ''}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary placeholder-opacity-50 focus:ring-2 focus:ring-offset-0 transition-all"
              placeholder="urgent, client, contrat..."
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 p-4 sm:p-6 border-theme border-t bg-theme-tertiary flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-lg transition-all"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-lg transition-all"
            >
              {isSaving ? t('common.saving') : (mode === 'edit' ? t('common.update') : t('common.create'))}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}