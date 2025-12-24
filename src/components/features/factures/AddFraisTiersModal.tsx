import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdClose } from 'react-icons/md';
import { showErrorAlert } from '../../../utils/alerts';

interface AddFraisTiersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (description: string, montant: number) => void;
}

export default function AddFraisTiersModal({ isOpen, onClose, onAdd }: AddFraisTiersModalProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [description, setDescription] = useState('');
  const [montant, setMontant] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      await showErrorAlert(
        'Champ requis',
        'Veuillez saisir une description'
      );
      return;
    }

    const montantNum = parseFloat(montant);
    if (isNaN(montantNum) || montantNum <= 0) {
      await showErrorAlert(
        'Montant invalide',
        'Veuillez saisir un montant valide'
      );
      return;
    }

    onAdd(description, montantNum);
    
    // Reset
    setDescription('');
    setMontant('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-theme-secondary rounded-none sm:rounded-2xl shadow-2xl w-full h-full sm:h-auto sm:max-w-md sm:max-h-[90vh] border-theme border flex flex-col overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-theme border-b flex-shrink-0 bg-gradient-to-r from-emerald-500 to-teal-600">
          <h2 className="text-lg sm:text-xl font-bold text-white">{t('factures.frais.title')}</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <MdClose className="text-xl sm:text-2xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-2">
              {t('factures.frais.description')}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('factures.frais.descriptionPlaceholder')}
              className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary placeholder-opacity-50 focus:ring-2 focus:ring-offset-0 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-theme-secondary mb-2">
             {t('factures.frais.montant')}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              placeholder= {t('factures.frais.montantPlaceholder')}
              className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary placeholder-opacity-50 focus:ring-2 focus:ring-offset-0 transition-all"
              required
            />
          </div>

          {/* Actions */}
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
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg transition-all"
            >
              {t('factures.frais.addBtn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}