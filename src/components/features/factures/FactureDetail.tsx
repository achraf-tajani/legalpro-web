import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { factureService } from '../../../services/facture.service';
import type { Facture } from '../../../types/facture.types';
import { MdArrowBack, MdDownload, MdEdit, MdDelete } from 'react-icons/md';
import html2pdf from 'html2pdf.js';
import InvoiceTemplate from './InvoiceTemplate';
import { createRoot } from 'react-dom/client';
import InvoicePreviewModal from './InvoicePreviewModal';
import { useClients } from '../../../hooks/useClients';
import { useDossiers } from '../../../hooks/useDossiers';
export default function FactureDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [facture, setFacture] = useState<Facture | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false); 
  const { clients } = useClients();
  const { dossiers } = useDossiers();
  useEffect(() => {
    const fetchFacture = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await factureService.getById(id);
        setFacture(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement de la facture');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacture();
  }, [id]);

    const handleDownloadPDF = async () => {
    try {
        // Créer un container temporaire
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.left = '-9999px';
        document.body.appendChild(tempContainer);

        // Render le template React dans le container
        const root = createRoot(tempContainer);
        root.render(
        <InvoiceTemplate 
            facture={facture!}
            clientInfo={{
            nom: clients.find(c => c.id === facture!.id_client)?.nom || 'Client',
            prenom: clients.find(c => c.id === facture!.id_client)?.prenom,
            adresse: clients.find(c => c.id === facture!.id_client)?.adresse,
            ville: clients.find(c => c.id === facture!.id_client)?.ville,
            code_postal: clients.find(c => c.id === facture!.id_client)?.code_postal,
            }}
        />
        );


        // Attendre que le render soit terminé
        await new Promise(resolve => setTimeout(resolve, 500));

        // Options pour html2pdf
        const options = {
            margin: 0,
            filename: `Facture_${facture!.numero}.pdf`,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
        };

        // Générer le PDF
        // Générer le PDF
        const element = tempContainer.querySelector('#invoice-template') as HTMLElement;
        if (!element) {
            throw new Error('Template non trouvé');
        }
        await html2pdf().set(options).from(element).save();

        // Nettoyer
        root.unmount();
        document.body.removeChild(tempContainer);

    } catch (error) {
        console.error('Erreur génération PDF:', error);
        alert('Erreur lors de la génération du PDF');
    }
    };

  const handleDelete = async () => {
    if (!window.confirm('Supprimer cette facture ?')) return;
    
    try {
      await factureService.delete(id!);
      navigate('/factures');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'payee':
        return 'bg-green-600 text-white border-green-500';
      case 'envoyee':
        return 'bg-blue-600 text-white border-blue-500';
      case 'en_retard':
        return 'bg-red-600 text-white border-red-500';
      case 'brouillon':
        return 'bg-gray-600 text-white border-gray-500';
      case 'annulee':
        return 'bg-slate-600 text-white border-slate-500';
      default:
        return 'bg-slate-600 text-white border-slate-500';
    }
  };

  const getStatutLabel = (statut: string) => {
    return t(`factures.statut.${statut}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !facture) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/factures')}
          className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
        >
          <MdArrowBack />
          <span>{t('common.back')}</span>
        </button>
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl">
          {error || 'Facture introuvable'}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/factures')}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <MdArrowBack className="text-xl" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Facture {facture.numero}</h1>
            <p className="text-slate-400 mt-1">
              {new Date(facture.date_emission).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatutColor(facture.statut)}`}>
            {getStatutLabel(facture.statut)}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all"
          >
            <MdDownload />
            <span>{t('factures.telechargerPDF')}</span>
          </button>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all"
            >
            <span>Aperçu PDF</span>
            </button>
          <button
            onClick={handleDelete}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-all border border-red-500/30"
          >
            <MdDelete />
            <span>{t('common.delete')}</span>
          </button>
        </div>
      </div>

      {/* Contenu facture */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Informations</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                <p className="text-sm text-slate-400">{t('factures.dossier')}</p>
                <p className="text-white font-semibold">
                    {dossiers.find(d => d.id === facture.id_dossier)?.titre || 'Dossier inconnu'}
                </p>
                </div>
                <div>
                <p className="text-sm text-slate-400">{t('factures.client')}</p>
                <p className="text-white font-semibold">
                    {clients.find(c => c.id === facture.id_client)?.nom || 'Client inconnu'}
                </p>
                </div>
              <div>
                <p className="text-sm text-slate-400">{t('factures.dateEmission')}</p>
                <p className="text-white font-semibold">
                  {new Date(facture.date_emission).toLocaleDateString('fr-FR')}
                </p>
              </div>
              {facture.date_echeance && (
                <div>
                  <p className="text-sm text-slate-400">{t('factures.dateEcheance')}</p>
                  <p className="text-white font-semibold">
                    {new Date(facture.date_echeance).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Lignes de facturation */}
          {facture.details?.lignes && (
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">{t('factures.detail.lignes')}</h3>
              <div className="space-y-3">
                {facture.details.lignes.map((ligne, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-white font-semibold">{ligne.description}</p>
                      <p className="text-xs text-slate-400">{ligne.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{ligne.prix_total.toFixed(2)} €</p>
                      <p className="text-xs text-slate-400">
                        {ligne.quantite} × {ligne.prix_unitaire.toFixed(2)} €
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {facture.notes && (
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Notes</h3>
              <p className="text-slate-300">{facture.notes}</p>
            </div>
          )}
        </div>

        {/* Colonne droite : Totaux */}
        <div className="space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Montants</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-slate-400">
                <span>{t('factures.detail.sousTotal')}</span>
                <span>{facture.montant_ht.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>{t('factures.detail.tva')} ({facture.taux_tva}%)</span>
                <span>{((facture.montant_ttc - facture.montant_ht)).toFixed(2)} €</span>
              </div>
              {facture.reduction > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Remise</span>
                  <span>- {facture.reduction.toFixed(2)} €</span>
                </div>
              )}
              {facture.details?.montant_avance_avocat && facture.details.montant_avance_avocat > 0 && (
                <div className="flex justify-between text-blue-400">
                  <span>{t('factures.detail.avanceAvocat')}</span>
                  <span>- {facture.details.montant_avance_avocat.toFixed(2)} €</span>
                </div>
              )}
              <div className="border-t border-slate-700 pt-3 flex justify-between text-white font-bold text-xl">
                <span>{t('factures.detail.totalTTC')}</span>
                <span>{facture.montant_ttc.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Paiement */}
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Paiement</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Montant payé</span>
                <span>{facture.montant_paye.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-white font-semibold">
                <span>Reste à payer</span>
                <span>{(facture.montant_ttc - facture.montant_paye).toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>
        {/* Aperçu PDF */}
            <InvoicePreviewModal
            isOpen={showPreview}
            onClose={() => setShowPreview(false)}
            facture={facture}
            clientInfo={{
                nom: clients.find(c => c.id === facture.id_client)?.nom || 'Client',
                prenom: clients.find(c => c.id === facture.id_client)?.prenom,
                adresse: clients.find(c => c.id === facture.id_client)?.adresse,
                ville: clients.find(c => c.id === facture.id_client)?.ville,
                code_postal: clients.find(c => c.id === facture.id_client)?.code_postal,
            }}
            />
      </div>
    </div>
  );
}