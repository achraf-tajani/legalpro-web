import { MdClose } from 'react-icons/md';
import InvoiceTemplate from './InvoiceTemplate';
import type { Facture } from '../../../types/facture.types';
import { useTranslation } from 'react-i18next';

interface InvoicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  facture: Facture;
  clientInfo?: {
    nom: string;
    prenom?: string;
    adresse?: string;
    ville?: string;
    code_postal?: string;
  };
}

export default function InvoicePreviewModal({ isOpen, onClose, facture, clientInfo }: InvoicePreviewModalProps) {
  if (!isOpen) return null;
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90vh] bg-white rounded-none sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
           <h3 className="text-white font-bold text-base sm:text-lg">{t('factures.preview.title')}</h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
          >
            <MdClose className="text-xl sm:text-2xl" />
          </button>
        </div>

        {/* Contenu avec scroll */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-8">
            <InvoiceTemplate facture={facture} clientInfo={clientInfo} />
          </div>
        </div>
      </div>
    </div>
  );
}