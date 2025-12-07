import { useEffect, useState } from 'react';
import { MdClose } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import type { CreateProcedureDto, Procedure } from '../../../types/procedure.types';
import { PROCEDURES_PAR_TYPE_DOSSIER, PROCEDURES_COMMUNES } from '../../../config/procedures.config';

interface CreateProcedureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateProcedureDto) => Promise<void>;
  onUpdate?: (id: string, data: CreateProcedureDto) => Promise<void>;
  dossierId?: string;  // ← Maintenant optionnel
  dossierType?: string;  // ← Maintenant optionnel
  procedure?: Procedure | null;
  mode?: 'create' | 'edit';
  dossiers?: Array<{ id: string; titre: string; type: string }>;  // ← Nouveau : liste des dossiers
}

export default function CreateProcedureModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  onUpdate,
  dossierId,
  dossierType,
  procedure = null,
  mode = 'create',
  dossiers = []
}: CreateProcedureModalProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isLoading, setIsLoading] = useState(false);
  const [showCustomType, setShowCustomType] = useState(false);
  const [selectedDossierId, setSelectedDossierId] = useState<string>(dossierId || '');
  const [selectedDossierType, setSelectedDossierType] = useState<string>(dossierType || '');
  
  const [formData, setFormData] = useState<CreateProcedureDto>(
  procedure && mode === 'edit' 
    ? {
        id_dossier: procedure.id_dossier,
        titre: procedure.titre,
        description: procedure.description || '',
        type: procedure.type,
        etape: procedure.etape || '',
        deadline: procedure.deadline || '',
        date_evenement: procedure.date_evenement || '',
        statut: procedure.statut,
        priorite: procedure.priorite,
        tribunal: procedure.tribunal || '',
        juge_assigne: procedure.juge_assigne || '',
        salle: procedure.salle || '',
        notes: procedure.notes || '',
        frais_associes: procedure.frais_associes || undefined,
      }
    : {
        id_dossier: dossierId,
        titre: '',
        description: '',
        type: '',
        etape: '',
        deadline: '',
        date_evenement: '',
        statut: 'scheduled',
        priorite: 'normal',
        tribunal: '',
        juge_assigne: '',
        salle: '',
        notes: '',
        frais_associes: undefined,
      }
);
    useEffect(() => {
    if (procedure && mode === 'edit') {
        setFormData({
        id_dossier: procedure.id_dossier,
        titre: procedure.titre,
        description: procedure.description || '',
        type: procedure.type,
        etape: procedure.etape || '',
        deadline: procedure.deadline ? procedure.deadline.slice(0, 16) : '',
        date_evenement: procedure.date_evenement ? procedure.date_evenement.slice(0, 16) : '',
        statut: procedure.statut,
        priorite: procedure.priorite,
        tribunal: procedure.tribunal || '',
        juge_assigne: procedure.juge_assigne || '',
        salle: procedure.salle || '',
        notes: procedure.notes || '',
        frais_associes: procedure.frais_associes || undefined,
        });
      setSelectedDossierId(procedure.id_dossier);
      if (procedure.type) {
        setShowCustomType(false);
      }
    } else {
        const initialDossierId = dossierId || selectedDossierId || '';
        setFormData({
          id_dossier: initialDossierId,
          titre: '',
          description: '',
          type: '',
          etape: '',
          deadline: '',
          date_evenement: '',
          statut: 'scheduled',
          priorite: 'normal',
          tribunal: '',
          juge_assigne: '',
          salle: '',
          notes: '',
          frais_associes: undefined,
        } as CreateProcedureDto);  // ← Force le type
        setSelectedDossierId(initialDossierId);
        setSelectedDossierType(dossierType || '');
        setShowCustomType(false);
    }
  }, [procedure, mode, dossierId, dossierType]);
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    if (mode === 'edit' && procedure && onUpdate) {
      await onUpdate(procedure.id, formData);
    } else {
      await onSubmit(formData);
    }
    onClose();
    setShowCustomType(false);
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
  } finally {
    setIsLoading(false);
  }
};

  if (!isOpen) return null;

  // Types de procédures selon le type de dossier
  const currentDossierType = selectedDossierType || dossierType || '';
  const proceduresRecommandees = PROCEDURES_PAR_TYPE_DOSSIER[currentDossierType as keyof typeof PROCEDURES_PAR_TYPE_DOSSIER] || [];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div 
        className="bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-slate-800"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
            {mode === 'edit' ? t('procedures.update') : t('procedures.new')}
            </h2>
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
            {/* Sélecteur de dossier (uniquement si pas de dossierId fourni) */}
            {!dossierId && dossiers.length > 0 && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {t('procedures.modal.dossier')} *
                </label>
                <select
                  required
                  value={selectedDossierId}
                  onChange={(e) => {
                    const dossier = dossiers.find(d => d.id === e.target.value);
                    setSelectedDossierId(e.target.value);
                    setSelectedDossierType(dossier?.type || '');
                    setFormData({ ...formData, id_dossier: e.target.value });
                  }}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="">{t('procedures.modal.selectDossier')}</option>
                  {dossiers.map((dossier) => (
                    <option key={dossier.id} value={dossier.id}>
                      {dossier.titre}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {/* Titre */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('procedures.modal.titre')} *
              </label>
              <input
                type="text"
                required
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Ex: Audience au tribunal"
              />
            </div>

            {/* Type de procédure */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('procedures.modal.type')} *
              </label>
              {!showCustomType ? (
                <select
                  required
                  value={formData.type}
                  onChange={(e) => {
                    if (e.target.value === 'custom') {
                      setShowCustomType(true);
                      setFormData({ ...formData, type: '' });
                    } else {
                      setFormData({ ...formData, type: e.target.value });
                    }
                  }}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value=""> {t('procedures.modal.selectType')}</option>
                  
                  {proceduresRecommandees.length > 0 && (
                    <optgroup label={t('procedures.modal.recommandees')}>
                      {proceduresRecommandees.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </optgroup>
                  )}
                  
                  <optgroup label={t('procedures.modal.communes')}>
                    {PROCEDURES_COMMUNES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </optgroup>
                  
                  <option value="custom">{t('procedures.modal.customType')}</option>
                </select>
              ) : (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="flex-1 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Saisir le type de procédure"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowCustomType(false);
                      setFormData({ ...formData, type: '' });
                    }}
                    className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all"
                  >
                    {t('common.cancel')}
                  </button>
                </div>
              )}
            </div>

            {/* Date événement */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t('procedures.modal.dateEvenement')}
              </label>
              <input
                type="datetime-local"
                value={formData.date_evenement}
                onChange={(e) => setFormData({ ...formData, date_evenement: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t('procedures.modal.deadline')}
              </label>
              <input
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                    {t('procedures.modal.statut')}
              </label>
              <select
                value={formData.statut}
                onChange={(e) => setFormData({ ...formData, statut: e.target.value as any })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="scheduled">{t('procedures.modal.statutScheduled')}</option>
                <option value="in_progress">{t('procedures.modal.statutInProgress')}</option>
                <option value="postponed">{t('procedures.modal.statutPostponed')}</option>
                <option value="completed">{t('procedures.modal.statutCompleted')}</option>
                <option value="cancelled">{t('procedures.modal.statutCancelled')}</option>
              </select>
            </div>

            {/* Priorité */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('procedures.modal.priorite')}
              </label>
              <select
                value={formData.priorite}
                onChange={(e) => setFormData({ ...formData, priorite: e.target.value as any })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="low">{t('procedures.modal.prioriteLow')}</option>
                <option value="normal">{t('procedures.modal.prioriteNormal')}</option>
                <option value="high">{t('procedures.modal.prioriteHigh')}</option>
                <option value="critical">{t('procedures.modal.prioriteCritical')}</option>
              </select>
            </div>

            {/* Tribunal */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('procedures.modal.tribunal')}
              </label>
              <input
                type="text"
                value={formData.tribunal}
                onChange={(e) => setFormData({ ...formData, tribunal: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder={t('procedures.modal.tribunalPlaceholder')}
              />
            </div>

            {/* Juge */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {t('procedures.modal.juge')}
              </label>
              <input
                type="text"
                value={formData.juge_assigne}
                onChange={(e) => setFormData({ ...formData, juge_assigne: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder={t('procedures.modal.jugePlaceholder')}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
               {t('procedures.modal.description')}
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder={t('procedures.modal.descriptionPlaceholder')}
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
                <span>{t('common.saving')}</span>
              </>
            ) : (
                <span>{mode === 'edit' ? t('common.update') : t('procedures.modal.create')}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}