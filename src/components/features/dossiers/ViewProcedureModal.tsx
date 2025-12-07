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

  const getStatutColor = (statut: string) => {
  switch (statut) {
    case 'completed':
      return 'bg-green-600 text-white border-green-500';
    case 'in_progress':
      return 'bg-blue-600 text-white border-blue-500';
    case 'cancelled':
      return 'bg-red-600 text-white border-red-500';
    case 'postponed':
      return 'bg-yellow-600 text-white border-yellow-500';
    case 'scheduled':
      return 'bg-cyan-600 text-white border-cyan-500';
    default:
      return 'bg-slate-600 text-white border-slate-500';
  }
};

const getPrioriteColor = (priorite: string) => {
  switch (priorite) {
    case 'critical':
      return 'bg-red-600 text-white border-red-500';
    case 'high':
      return 'bg-orange-600 text-white border-orange-500';
    case 'normal':
      return 'bg-blue-600 text-white border-blue-500';
    case 'low':
      return 'bg-slate-600 text-white border-slate-500';
    default:
      return 'bg-slate-600 text-white border-slate-500';
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div 
        className="bg-slate-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-slate-800"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <MdGavel className="text-3xl text-white" />
                <h2 className="text-2xl font-bold text-white">{procedure.titre}</h2>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatutColor(procedure.statut)}`}>
                  {procedure.statut}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPrioriteColor(procedure.priorite)}`}>
                  {procedure.priorite}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
            >
              <MdClose className="text-2xl" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-240px)]">
          
          {/* Type */}
          <div>
          <label className="block text-sm font-semibold text-slate-400 mb-1">
            {t('procedures.modal.type')}
          </label>
            <p className="text-white text-lg">{procedure.type}</p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {procedure.date_evenement && (
              <div>
              <label className="block text-sm font-semibold text-slate-400 mb-1">
                <MdEvent className="inline mr-2" />
                {t('procedures.modal.dateEvenement')}
              </label>
                <p className="text-white">
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
                <label className="block text-sm font-semibold text-slate-400 mb-1">
                  <MdEvent className="inline mr-2" />
                  {t('procedures.modal.deadline')}
                </label>
                <p className="text-white">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {procedure.tribunal && (
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-1">  {t('procedures.modal.tribunal')}</label>
                <p className="text-white">{procedure.tribunal}</p>
              </div>
            )}

            {procedure.juge_assigne && (
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-1">  {t('procedures.modal.juge')}</label>
                <p className="text-white">{procedure.juge_assigne}</p>
              </div>
            )}

            {procedure.salle && (
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-1">  {t('procedures.modal.salle')}</label>
                <p className="text-white">{procedure.salle}</p>
              </div>
            )}

            {procedure.etape && (
              <div>
                <label className="block text-sm font-semibold text-slate-400 mb-1">  {t('procedures.modal.etape')}</label>
                <p className="text-white">{procedure.etape}</p>
              </div>
            )}
          </div>

          {/* Frais */}
          {procedure.frais_associes && (
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-1">
                {t('procedures.view.frais')}
              </label>
              <p className="text-white text-lg font-semibold">
                {procedure.frais_associes.toLocaleString()} €
              </p>
            </div>
          )}

          {/* Description */}
          {procedure.description && (
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-1">
                {t('procedures.modal.description')}
              </label>
              <p className="text-white whitespace-pre-wrap">{procedure.description}</p>
            </div>
          )}

          {/* Notes */}
          {procedure.notes && (
            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-1">
                {t('procedures.view.notes')}
              </label>
              <p className="text-slate-300 whitespace-pre-wrap">{procedure.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-800/50 border-t border-slate-700 flex justify-between">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all border border-red-500/30 disabled:opacity-50"
          >
            <MdDelete />
            <span>{isDeleting ? t('common.deleting') : t('common.delete')}</span>
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-slate-600 rounded-lg text-slate-300 font-semibold hover:bg-slate-700 transition-all"
            >
              {t('common.close')}
            </button>
            {onEdit && (
              <button
                onClick={() => {
                  onEdit(procedure);
                  onClose();
                }}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-semibold shadow-lg transition-all"
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