import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdClose } from 'react-icons/md';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      alert('Veuillez saisir une description');
      return;
    }

    const montantNum = parseFloat(montant);
    if (isNaN(montantNum) || montantNum <= 0) {
      alert('Veuillez saisir un montant valide');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-800" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">Ajouter des frais tiers</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description *
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Expertise judiciaire, Frais de greffe..."
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Montant (€) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg font-semibold transition-all"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}