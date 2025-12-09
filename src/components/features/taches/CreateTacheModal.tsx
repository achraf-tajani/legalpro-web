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
      alert('Veuillez sélectionner un dossier');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div 
        className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-slate-800 max-h-[90vh] overflow-y-auto"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-2xl font-bold text-white">
            {mode === 'edit' ? t('taches.edit.title') : t('taches.create.title')}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Sélecteur de dossier (si plusieurs dossiers disponibles) */}
          {!dossierId && dossiers && dossiers.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Dossier *
              </label>
              <select
                value={selectedDossierId}
                onChange={(e) => setSelectedDossierId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {t('taches.titre')} *
            </label>
            <input
              type="text"
              value={formData.titre}
              onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder={t('taches.titre')}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {t('taches.description')}
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder={t('taches.description')}
            />
          </div>

          {/* Priorité et Statut */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('taches.priorite')}
              </label>
              <select
                value={formData.priorite}
                onChange={(e) => setFormData({ ...formData, priorite: e.target.value as any })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="low">{t('taches.priorite.low')}</option>
                <option value="normal">{t('taches.priorite.normal')}</option>
                <option value="high">{t('taches.priorite.high')}</option>
                <option value="critical">{t('taches.priorite.critical')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('taches.statut')}
              </label>
              <select
                value={formData.statut}
                onChange={(e) => setFormData({ ...formData, statut: e.target.value as any })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('taches.dateEcheance')}
              </label>
              <input
                type="date"
                value={formData.date_echeance}
                onChange={(e) => setFormData({ ...formData, date_echeance: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('taches.progression')} ({formData.progression}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={formData.progression}
                onChange={(e) => setFormData({ ...formData, progression: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {t('taches.tags')}
            </label>
            <input
              type="text"
              value={formData.tags || ''}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="urgent, client, contrat..."
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all"
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