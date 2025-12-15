import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDossiers } from '../../../hooks/useDossiers';
import { useProcedures } from '../../../hooks/useProcedures';
import { useTachesByDossier } from '../../../hooks/useTaches';
import { factureService } from '../../../services/facture.service';
import AddFraisTiersModal from './AddFraisTiersModal';
import { 
  creerLigneProcedure, 
  creerLignePrestation,
  creerLigneFraisTiers,
  calculerFacture,
  TARIFS_GENERAUX
} from '../../..//config/pricing.config';
import type { LigneFacturation, RemiseFacture } from '../../../types/facture.types';
import { MdArrowBack, MdAdd, MdDelete } from 'react-icons/md';

export default function CreateFacture() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dossierId = searchParams.get('dossier');

  const { dossiers } = useDossiers();
  const [selectedDossierId, setSelectedDossierId] = useState(dossierId || '');
  const { procedures } = useProcedures(selectedDossierId || undefined);
  const { taches } = useTachesByDossier(selectedDossierId || undefined);

  const [lignes, setLignes] = useState<LigneFacturation[]>([]);
  const [remise] = useState<RemiseFacture | undefined>();
  const [dateEcheance, setDateEcheance] = useState('');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [acompte, setAcompte] = useState(0);

    useEffect(() => {
      if (selectedDossierId && procedures.length > 0) {
        setLignes([]);
        
        // Auto-ajouter les procédures
        const nouvellesLignes = procedures.map(proc => {
          const ligne = creerLigneProcedure(proc.type, 1);
          ligne.description = `${proc.type} - ${proc.titre}`;
          return ligne;
        });
        
        setLignes(nouvellesLignes);
      }
    }, [selectedDossierId, procedures]);
    // Sélectionner automatiquement le dossier si passé en paramètre
    useEffect(() => {
      if (dossierId) {
        setSelectedDossierId(dossierId);
      }
    }, [dossierId]);

    // Ajouter une procédure comme ligne

    const [isFraisModalOpen, setIsFraisModalOpen] = useState(false);

    const handleAddFraisTiersFromModal = (description: string, montant: number) => {
    const ligne = creerLigneFraisTiers(description, montant);
    setLignes([...lignes, ligne]);
    };
  // Ajouter une prestation générale
  const handleAddPrestation = (type: string) => {
    const prix = TARIFS_GENERAUX[type] || 0;
    const description = type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const ligne = creerLignePrestation('prestation', description, prix, 1);
    setLignes([...lignes, ligne]);
  };


  // Supprimer une ligne
  const handleDeleteLigne = (id: string) => {
    setLignes(lignes.filter(l => l.id !== id));
  };

  // Modifier le prix d'une ligne
  const handleUpdatePrix = (id: string, nouveauPrix: number) => {
    setLignes(lignes.map(l => 
      l.id === id 
        ? { ...l, prix_unitaire: nouveauPrix, prix_total: nouveauPrix * l.quantite, prix_modifie: true }
        : l
    ));
  };

  // Calculer les totaux
  const totaux = calculerFacture(lignes, remise);
  const resteAPayer = totaux.total_ttc - acompte;

  const getTarifLabel = (tarifKey: string) => {
  const tarifMap: Record<string, string> = {
    'consultation_initiale': t('factures.tarifs.consultation_initiale'),
    'consultation_suivi': t('factures.tarifs.consultation_suivi'),
    'heure_avocat': t('factures.tarifs.heure_avocat'),
    'deplacement_tribunal': t('factures.tarifs.deplacement_tribunal'),
    'creation_dossier': t('factures.tarifs.creation_dossier'),
    'cloture_dossier': t('factures.tarifs.cloture_dossier'),
    'recherche_jurisprudence': t('factures.tarifs.recherche_jurisprudence'),
    'redaction_memoire': t('factures.tarifs.redaction_memoire'),
    'analyse_document': t('factures.tarifs.analyse_document'),
    'redaction_conclusions': t('factures.tarifs.redaction_conclusions'),
    'conseil_telephonique': t('factures.tarifs.conseil_telephonique'),
  };
  return tarifMap[tarifKey] || tarifKey.replace(/_/g, ' ');
};
  // Générer la facture
  const handleGenerate = async () => {
    if (!selectedDossierId) {
      alert('Veuillez sélectionner un dossier');
      return;
    }

    if (lignes.length === 0) {
      alert('Veuillez ajouter au moins une ligne');
      return;
    }

    const dossier = dossiers.find(d => d.id === selectedDossierId);
    if (!dossier) return;
    if (!dossier.id_client) {
        alert('Ce dossier n\'a pas de client associé');
        return;
    }
    try {
      setIsSaving(true);

      // Générer le numéro de facture (simple incrémentation)
      const numero = `2025-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

      const factureData = {
        id_dossier: selectedDossierId,
        id_client: dossier.id_client,
        numero,
        montant_ht: totaux.sous_total_ht,
        taux_tva: 20,
        reduction: remise ? (remise.type === 'montant_fixe' ? remise.valeur : totaux.sous_total_ht * (remise.valeur / 100)) : 0,
        date_echeance: dateEcheance || undefined,
        statut: 'brouillon' as const,
        notes,
        details: {
          lignes: lignes.map(l => ({
            type: l.type,
            description: l.description,
            quantite: l.quantite,
            prix_unitaire: l.prix_unitaire,
            prix_total: l.prix_total,
            tva_applicable: l.tva_applicable,
          })),
          remise,
          montant_avance_avocat: totaux.montant_avance_avocat,
        },
      };

      const facture = await factureService.create(factureData);
      navigate(`/factures/${facture.id}`);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création de la facture');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 pb-4 border-b border-theme mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/factures')}
             className="p-2 rounded-lg transition-colors text-theme-muted hover:text-theme-primary"
            >
              <MdArrowBack className="text-xl" />
            </button>
            <h1 className="text-3xl font-bold text-theme-primary">{t('factures.create.title')}</h1>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isSaving || lignes.length === 0}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-lg transition-all"
          >
            <span>{isSaving ? t('common.saving') : t('factures.create.generate')}</span>
          </button>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
          {/* Colonne gauche : Sélection */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sélection dossier */}
        <div className="bg-theme-surface border-theme border rounded-2xl p-6">
         <h3 className="text-lg font-semibold text-theme-primary mb-4">{t('factures.create.selectDossier')}</h3>
          <select
            value={selectedDossierId}
            onChange={(e) => setSelectedDossierId(e.target.value)}
            className="w-full px-4 py-3 bg-theme-tertiary border-theme border rounded-xl text-theme-primary focus:ring-2 focus:ring-offset-0"
          >
            <option value="">-- {t('factures.create.selectDossier')} --</option>
            {dossiers.map(d => (
              <option key={d.id} value={d.id}>{d.titre}</option>
            ))}
          </select>
        </div>
            {/* Tâches du dossier */}
              {selectedDossierId && taches.length > 0 && (
                <div className="bg-theme-surface border-theme border rounded-2xl p-6">
                 <h3 className="text-lg font-semibold text-theme-primary mb-4">{t('factures.create.tasksTitle')}</h3>
                  <div className="space-y-2">
                    {taches.map(tache => (
                      <div
                        key={tache.id}
                        onClick={() => {
                          // Vérifier si déjà ajoutée
                          const dejaAjoutee = lignes.some(l => l.description.includes(tache.titre));
                          if (dejaAjoutee) {
                            // Retirer
                            setLignes(lignes.filter(l => !l.description.includes(tache.titre)));
                          } else {
                            // Ajouter avec prix suggéré
                            const prixSuggere = 200; // Prix par défaut pour une tâche
                            const ligne = creerLignePrestation(
                              'prestation',
                              `Tâche: ${tache.titre}`,
                              prixSuggere,
                              1
                            );
                            setLignes([...lignes, ligne]);
                          }
                        }}
                        className={`p-3 rounded-lg cursor-pointer transition-all border ${
                          lignes.some(l => l.description.includes(tache.titre))
                          ? 'bg-emerald-500/20 border-emerald-500 text-theme-primary'
                          : 'bg-theme-tertiary border-theme hover:border-emerald-500 text-theme-secondary'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-semibold">{tache.titre}</p>
                            {tache.description && (
                              <p className="text-xs text-theme-muted mt-1 line-clamp-1">{tache.description}</p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-theme-secondary">200€</span>
                            {lignes.some(l => l.description.includes(tache.titre)) && (
                              <span className="text-emerald-400">✓</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}



            {/* Prestations générales */}
            <div className="bg-theme-surface border-theme border rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-theme-primary mb-4">Prestations générales</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(TARIFS_GENERAUX).map(type => (
                  <button
                    key={type}
                    onClick={() => handleAddPrestation(type)}
                    className="p-3 bg-theme-tertiary hover:bg-opacity-80 rounded-lg text-left transition-all border-theme border hover:border-emerald-500"
                  >
                    <p className="text-sm text-theme-primary">{getTarifLabel(type)}</p>
                    <p className="text-xs text-theme-secondary">{TARIFS_GENERAUX[type]} €</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Frais tiers */}
            <div className="bg-theme-surface border-theme border rounded-2xl p-6">
              <button
              onClick={() => setIsFraisModalOpen(true)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-theme-tertiary hover:bg-opacity-80 text-theme-primary rounded-lg transition-all"
              >
              <MdAdd />
              <span>{t('factures.frais.title')}</span>
              </button>
            </div>
          </div>

          {/* Colonne droite : Récapitulatif */}
          <div className="space-y-6">
            {/* Lignes de facturation */}
            <div className="bg-theme-surface border-theme border rounded-2xl p-6">
             <h3 className="text-lg font-semibold text-theme-primary mb-4">{t('factures.detail.lignes')}</h3>
              
              {lignes.length === 0 ? (
                 <p className="text-center text-theme-muted py-8">{t('factures.create.noLines')}</p>
              ) : (
                <div className="space-y-3">
                  {lignes.map(ligne => (
                     <div key={ligne.id} className="p-3 bg-theme-tertiary rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                         <p className="text-sm font-semibold text-theme-primary">{ligne.description}</p>
                          <p className="text-xs text-theme-secondary">{ligne.type}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteLigne(ligne.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <MdDelete />
                        </button>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          value={ligne.prix_unitaire}
                          onChange={(e) => handleUpdatePrix(ligne.id, parseFloat(e.target.value))}
                         className="w-24 px-2 py-1 bg-theme-tertiary border-theme border rounded text-theme-primary text-sm"
                        />
                        <span className="text-theme-primary font-semibold">{ligne.prix_total.toFixed(2)} €</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Totaux */}
            <div className="bg-theme-surface border-theme border rounded-2xl p-6">
              <div className="space-y-2">
                <div className="flex justify-between text-theme-secondary">
                  <span>{t('factures.detail.sousTotal')}</span>
                  <span>{totaux.sous_total_ht.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-theme-secondary">
                  <span>{t('factures.detail.tva')} (20%)</span>
                  <span>{totaux.montant_tva.toFixed(2)} €</span>
                </div>
                  <div className="border-theme border-t pt-2 flex justify-between text-theme-primary font-bold text-lg">
                  <span>{t('factures.detail.totalTTC')}</span>
                  <span>{totaux.total_ttc.toFixed(2)} €</span>
                  </div>
                  {acompte > 0 && (
                  <div className="flex justify-between text-emerald-400">
                      <span>{t('factures.create.acomptePaid')}</span>
                      <span>- {acompte.toFixed(2)} €</span>
                  </div>
                  )}
                  <div className="flex justify-between text-theme-primary font-bold text-xl">
                  <span>{t('factures.create.resteToPay')}</span>
                  <span>{resteAPayer.toFixed(2)} €</span>
                  </div>
              </div>
            </div>

            {/* Date échéance et notes */}
             <div className="bg-theme-surface border-theme border rounded-2xl p-6 space-y-4">
              <div>
               <label className="block text-sm font-semibold text-theme-secondary mb-2">
                  {t('factures.dateEcheance')}
                </label>
                <input
                  type="date"
                  value={dateEcheance}
                  onChange={(e) => setDateEcheance(e.target.value)}
                 className="w-full px-4 py-2 bg-theme-tertiary border-theme border rounded-lg text-theme-primary"
                />
              </div>
              <div>
               <label className="block text-sm font-semibold text-theme-secondary mb-2">{t('factures.create.notes')}</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                 className="w-full px-4 py-2 bg-theme-tertiary border-theme border rounded-lg text-theme-primary"
                />
              </div>
            </div>
            {/* Acompte client */}
              <div className="bg-theme-surface border-theme border rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-theme-primary mb-4">{t("factures.create.acompteTitle")}</h3>
              <div>
                  <label className="block text-sm font-medium text-theme-secondary mb-2">
                  {t('factures.create.acompteLabel')}
                  </label>
                  <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={acompte}
                  onChange={(e) => setAcompte(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                 className="w-full px-4 py-2 bg-theme-tertiary border-theme border rounded-lg text-theme-primary"
                  />
              </div>
              </div>
          </div>
        </div>
      </div>

      <AddFraisTiersModal
        isOpen={isFraisModalOpen}
        onClose={() => setIsFraisModalOpen(false)}
        onAdd={handleAddFraisTiersFromModal}
        />
    </div>
  );
}