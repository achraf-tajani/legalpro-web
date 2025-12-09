import { MdClose } from 'react-icons/md';
import InvoiceTemplate from './InvoiceTemplate';
import type { Facture } from '../../../types/facture.types';

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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex items-center justify-between">
          <h3 className="text-white font-bold text-lg">Aperçu de la facture PDF</h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg p-2 transition-all"
          >
            <MdClose className="text-2xl" />
          </button>
        </div>

        {/* Contenu avec scroll */}
        <div className="overflow-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          <div className="p-8">
            <InvoiceTemplate facture={facture} clientInfo={clientInfo} />
          </div>
        </div>
      </div>
    </div>
  );
}