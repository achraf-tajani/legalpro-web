import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { factureService } from '../../../services/facture.service';
import type { Facture } from '../../../types/facture.types';
import { MdArrowBack, MdDownload, MdDelete } from 'react-icons/md';
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
      return 'badge-green';
    case 'envoyee':
      return 'badge-blue';
    case 'en_retard':
      return 'badge-red';
    case 'brouillon':
      return 'badge-gray';
    case 'annulee':
      return 'badge-gray';
    default:
      return 'badge-gray';
    }
  };

  const getStatutLabel = (statut: string) => {
    return t(`factures.statut.${statut}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
       <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'rgba(var(--color-accentStart), 0.3)', borderTopColor: 'transparent' }}></div>
      </div>
    );
  }

  if (error || !facture) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/factures')}
          className="flex items-center space-x-2 text-theme-muted hover:text-theme-primary transition-colors"
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
            className="p-2 rounded-lg transition-colors text-theme-muted hover:text-theme-primary"
          >
            <MdArrowBack className="text-xl" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-theme-primary">{t('factures.detail.title')} {facture.numero}</h1>
           <p className="text-theme-secondary mt-1">
              {new Date(facture.date_emission).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatutColor(facture.statut)}`}>
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
            className="flex items-center space-x-2 px-4 py-2 bg-theme-tertiary border border-theme hover:bg-opacity-80 text-theme-primary rounded-lg transition-all"
            >
            <span>{t('factures.detail.apercuPDF')}</span>
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
          <div className="bg-theme-surface border-theme border rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-theme-primary mb-4">{t('factures.detail.informations')}</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                <p className="text-sm text-theme-secondary">{t('factures.dossier')}</p>
                <p className="text-theme-primary font-semibold">
                    {dossiers.find(d => d.id === facture.id_dossier)?.titre || 'Dossier inconnu'}
                </p>
                </div>
                <div>
                <p className="text-sm text-theme-secondary">{t('factures.client')}</p>
                <p className="text-theme-primary font-semibold">
                    {clients.find(c => c.id === facture.id_client)?.nom || 'Client inconnu'}
                </p>
                </div>
              <div>
                <p className="text-sm text-theme-secondary">{t('factures.dateEmission')}</p>
                <p className="text-theme-primary font-semibold">
                  {new Date(facture.date_emission).toLocaleDateString('fr-FR')}
                </p>
              </div>
              {facture.date_echeance && (
                <div>
                  <p className="text-sm text-theme-secondary">{t('factures.dateEcheance')}</p>
                  <p className="text-theme-primary font-semibold">
                    {new Date(facture.date_echeance).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Lignes de facturation */}
          {facture.details?.lignes && (
            <div className="bg-theme-surface border-theme border rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-theme-primary mb-4">{t('factures.detail.lignes')}</h3>
              <div className="space-y-3">
                {facture.details.lignes.map((ligne, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-theme-tertiary rounded-lg">
                    <div className="flex-1">
                      <p className="text-theme-primary font-semibold">{ligne.description}</p>
                      <p className="text-xs text-theme-secondary">{ligne.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-theme-primary font-semibold">{ligne.prix_total.toFixed(2)} €</p>
                      <p className="text-xs text-theme-secondary">
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
            <div className="bg-theme-surface border-theme border rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-theme-primary mb-4">{t('factures.create.notes')}</h3>
              <p className="text-theme-secondary">{facture.notes}</p>
            </div>
          )}
        </div>

        {/* Colonne droite : Totaux */}
        <div className="space-y-6">
          <div className="bg-theme-surface border-theme border rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-theme-primary mb-4">{t('factures.detail.montants')}</h3>
            <div className="space-y-3">
               <div className="flex justify-between text-theme-secondary">
                <span>{t('factures.detail.sousTotal')}</span>
                <span>{facture.montant_ht.toFixed(2)} €</span>
              </div>
               <div className="flex justify-between text-theme-secondary">
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
              <div className="border-theme border-t pt-3 flex justify-between text-theme-primary font-bold text-xl">
                <span>{t('factures.detail.totalTTC')}</span>
                <span>{facture.montant_ttc.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Paiement */}
          <div className="bg-theme-surface border-theme border rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-theme-primary mb-4">{t('factures.detail.paiement')}</h3>
            <div className="space-y-2">
               <div className="flex justify-between text-theme-secondary">
                <span>{t('factures.detail.montantPaye')}</span>
                <span>{facture.montant_paye.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-theme-primary font-semibold">
                <span>{t('factures.detail.resteAPayer')}</span>
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