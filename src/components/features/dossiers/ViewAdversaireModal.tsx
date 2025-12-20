import { MdClose, MdPerson, MdEmail, MdPhone, MdBusiness, MdLocationOn, MdGavel, MdNotes } from 'react-icons/md';
import type { Adversaire } from '../../../types/adversaire.types';

interface ViewAdversaireModalProps {
  isOpen: boolean;
  onClose: () => void;
  adversaire: Adversaire | null;
  onEdit: (adversaire: Adversaire) => void;
  onDelete: (id: string) => void;
}

export default function ViewAdversaireModal({
  isOpen,
  onClose,
  adversaire,
  onEdit,
  onDelete,
}: ViewAdversaireModalProps) {
  if (!isOpen || !adversaire) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-theme-secondary rounded-none sm:rounded-2xl shadow-2xl w-full h-full sm:h-auto sm:max-w-lg sm:max-h-[90vh] border-theme border flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-theme border-b flex-shrink-0 bg-gradient-to-r from-red-500 to-rose-600">
          <div className="flex items-center space-x-3">
            <MdPerson className="text-white text-xl sm:text-2xl" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {adversaire.nom}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
          >
            <MdClose className="text-xl sm:text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {/* Type */}
          {adversaire.type_adversaire && (
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MdBusiness className="text-xl text-red-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-theme-secondary mb-1">Type</label>
                <p className="text-theme-primary">{adversaire.type_adversaire}</p>
              </div>
            </div>
          )}

          {/* Fonction */}
          {adversaire.fonction && (
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MdPerson className="text-xl text-red-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-theme-secondary mb-1">Fonction</label>
                <p className="text-theme-primary">{adversaire.fonction}</p>
              </div>
            </div>
          )}

          {/* Email */}
          {adversaire.email && (
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MdEmail className="text-xl text-red-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-theme-secondary mb-1">Email</label>
                <p className="text-theme-primary">{adversaire.email}</p>
              </div>
            </div>
          )}

          {/* Téléphone */}
          {adversaire.telephone && (
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MdPhone className="text-xl text-red-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-theme-secondary mb-1">Téléphone</label>
                <p className="text-theme-primary">{adversaire.telephone}</p>
              </div>
            </div>
          )}

          {/* Avocat adverse */}
          {adversaire.avocat_adverse && (
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MdGavel className="text-xl text-red-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-theme-secondary mb-1">Avocat adverse</label>
                <p className="text-theme-primary">
                  {adversaire.avocat_adverse}
                  {adversaire.cabinet && <span className="text-theme-muted"> ({adversaire.cabinet})</span>}
                </p>
              </div>
            </div>
          )}

          {/* Adresse */}
          {adversaire.adresse && (
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MdLocationOn className="text-xl text-red-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-theme-secondary mb-1">Adresse</label>
                <p className="text-theme-primary">{adversaire.adresse}</p>
              </div>
            </div>
          )}

          {/* Stratégie connue */}
          {adversaire.strategie_known && (
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MdNotes className="text-xl text-red-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-theme-secondary mb-1">Notes / Stratégie</label>
                <p className="text-theme-primary whitespace-pre-wrap">{adversaire.strategie_known}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-theme border-t bg-theme-tertiary flex-shrink-0">
          <button
            onClick={() => onDelete(adversaire.id)}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-semibold transition-all"
          >
            Supprimer
          </button>
          <button
            onClick={() => onEdit(adversaire)}
            className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-xl font-semibold transition-all"
          >
            Modifier
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-500/20 hover:bg-gray-500/30 text-theme-secondary rounded-xl font-semibold transition-all"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}