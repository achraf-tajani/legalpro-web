import { useState } from 'react';
import { MdClose, MdEdit, MdDelete, MdEvent, MdGavel } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import type { Procedure } from '../../../types/procedure.types';

interface ViewProcedureModalProps {
  isOpen: boolean;
  onClose: () => void;
  procedure: Procedure | null;
  onEdit?: (procedure: Procedure) => void;
  onDelete?: (id: string) => void;
}

export default function ViewProcedureModal({ 
  isOpen, 
  onClose, 
  procedure,
  onEdit,
  onDelete
}: ViewProcedureModalProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !procedure) return null;

  const handleDelete = async () => {
    if (!window.confirm(t('procedures.view.confirmDelete'))) return;
    
    setIsDeleting(true);
    try {
      if (onDelete) {
        await onDelete(procedure.id);
      }
      onClose();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsDeleting(false);
    }
  };

const getStatutBadgeClass = (statut: string) => {
  switch (statut) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
    case 'in_progress':
    case 'scheduled':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
    case 'cancelled':
      return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
    case 'postponed':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

const getPrioriteBadgeClass = (priorite: string) => {
  switch (priorite) {
    case 'critical':
      return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300';
    case 'high':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300';
    case 'normal':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
    case 'low':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
      <div 
        className="bg-theme-secondary rounded-none sm:rounded-2xl shadow-2xl w-full h-full sm:h-auto sm:max-w-3xl sm:max-h-[90vh] border-theme border flex flex-col overflow-hidden"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-accent-gradient p-4 sm:p-6 flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                <MdGavel className="text-2xl sm:text-3xl text-white flex-shrink-0" />
                <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{procedure.titre}</h2>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getStatutBadgeClass(procedure.statut)}`}>
                  {procedure.statut}
                </span>
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getPrioriteBadgeClass(procedure.priorite)}`}>
                  {procedure.priorite}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white flex-shrink-0"
            >
              <MdClose className="text-xl sm:text-2xl" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          
          {/* Type */}
          <div>
            <label className="block text-sm font-semibold text-theme-secondary mb-1">
              {t('procedures.modal.type')}
            </label>
            <p className="text-theme-primary text-base sm:text-lg">{procedure.type}</p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {procedure.date_evenement && (
              <div>
                <label className="block text-sm font-semibold text-theme-secondary mb-1">
                  <MdEvent className="inline mr-2" />
                  {t('procedures.modal.dateEvenement')}
                </label>
                <p className="text-theme-primary text-sm sm:text-base">
                  {new Date(procedure.date_evenement).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}

            {procedure.deadline && (
              <div>
                <label className="block text-sm font-semibold text-theme-secondary mb-1">
                  <MdEvent className="inline mr-2" />
                  {t('procedures.modal.deadline')}
                </label>
                <p className="text-theme-primary text-sm sm:text-base">
                  {new Date(procedure.deadline).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Infos juridiques */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {procedure.tribunal && (
              <div>
                <label className="block text-sm font-semibold text-theme-secondary mb-1">
                  {t('procedures.modal.tribunal')}
                </label>
                <p className="text-theme-primary text-sm sm:text-base">{procedure.tribunal}</p>
              </div>
            )}

            {procedure.juge_assigne && (
              <div>
                <label className="block text-sm font-semibold text-theme-secondary mb-1">
                  {t('procedures.modal.juge')}
                </label>
                <p className="text-theme-primary text-sm sm:text-base">{procedure.juge_assigne}</p>
              </div>
            )}

            {procedure.salle && (
              <div>
                <label className="block text-sm font-semibold text-theme-secondary mb-1">
                  {t('procedures.modal.salle')}
                </label>
                <p className="text-theme-primary text-sm sm:text-base">{procedure.salle}</p>
              </div>
            )}

            {procedure.etape && (
              <div>
                <label className="block text-sm font-semibold text-theme-secondary mb-1">
                  {t('procedures.modal.etape')}
                </label>
                <p className="text-theme-primary text-sm sm:text-base">{procedure.etape}</p>
              </div>
            )}
          </div>

          {/* Frais */}
          {procedure.frais_associes && (
            <div>
              <label className="block text-sm font-semibold text-theme-secondary mb-1">
                {t('procedures.view.frais')}
              </label>
              <p className="text-theme-primary text-lg sm:text-xl font-semibold">
                {procedure.frais_associes.toLocaleString()} €
              </p>
            </div>
          )}

          {/* Description */}
          {procedure.description && (
            <div>
              <label className="block text-sm font-semibold text-theme-secondary mb-1">
                {t('procedures.modal.description')}
              </label>
              <p className="text-theme-primary whitespace-pre-wrap text-sm sm:text-base">{procedure.description}</p>
            </div>
          )}

          {/* Notes */}
          {procedure.notes && (
            <div>
              <label className="block text-sm font-semibold text-theme-secondary mb-1">
                {t('procedures.view.notes')}
              </label>
              <p className="text-theme-secondary whitespace-pre-wrap text-sm sm:text-base">{procedure.notes}</p>
            </div>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="p-4 sm:p-6 bg-theme-tertiary border-theme border-t flex flex-col sm:flex-row justify-between gap-3 flex-shrink-0">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all border border-red-500/30 disabled:opacity-50 order-2 sm:order-1"
          >
            <MdDelete />
            <span>{isDeleting ? t('common.deleting') : t('common.delete')}</span>
          </button>
          
          <div className="flex flex-col-reverse sm:flex-row gap-3 order-1 sm:order-2">
            <button
              onClick={onClose}
              className="px-6 py-2 border-theme border rounded-lg text-theme-secondary font-semibold hover:bg-theme-tertiary transition-all"
            >
              {t('common.close')}
            </button>
            {onEdit && (
              <button
                onClick={() => {
                  onEdit(procedure);
                  onClose();
                }}
                className="flex items-center justify-center space-x-2 px-6 py-2 bg-accent-gradient hover:bg-accent-gradient-hover text-white rounded-lg font-semibold shadow-lg transition-all"
              >
                <MdEdit />
                <span>{t('common.edit')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}