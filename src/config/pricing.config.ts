import type { LigneFacturation, RemiseFacture } from '../types/facture.types';

// Configuration des tarifs par type de procédure
export const TARIFS_PROCEDURES: Record<string, number> = {
  // Civil
  'Assignation': 450,
  'Requête introductive': 400,
  'Audience': 300,
  'Constat d\'huissier': 200,
  'Mise en demeure': 150,
  'Référé': 500,
  'Saisie': 350,
  'Expertise judiciaire': 600,
  'Médiation': 400,
  'Conciliation': 350,

  // Pénal
  'Plainte simple': 250,
  'Constitution partie civile': 500,
  'Garde à vue': 400,
  'Instruction': 600,
  'Audition': 300,
  'Audience pénale': 400,

  // Commercial
  'Injonction de payer': 300,
  'Arbitrage': 800,
  'Résiliation de contrat': 450,
  'Dépôt de bilan': 1000,
  'Redressement judiciaire': 1500,
  'Liquidation judiciaire': 2000,

  // Administratif
  'Recours gracieux': 300,
  'Recours hiérarchique': 350,
  'Recours contentieux': 500,
  'Réclamation': 200,

  // Communes
  'Délibéré': 200,
  'Jugement': 400,
  'Appel': 800,
  'Pourvoi en cassation': 1200,
  'Opposition': 350,
};

// Tarifs généraux
export const TARIFS_GENERAUX: Record<string, number> = {
  consultation_initiale: 150,
  consultation_suivi: 100,
  heure_avocat: 200,
  deplacement_tribunal: 100,
  creation_dossier: 200,
  cloture_dossier: 150,
  recherche_jurisprudence: 180,
  redaction_memoire: 450,
  analyse_document: 120,
  redaction_conclusions: 350,
  conseil_telephonique: 80,
};

// Factory pour obtenir le prix d'une procédure
export function getPrixProcedure(typeProcedure: string): number {
  return TARIFS_PROCEDURES[typeProcedure] || 300; // Prix par défaut si non trouvé
}

// Factory pour créer une ligne de procédure
export function creerLigneProcedure(
  typeProcedure: string,
  quantite: number = 1
): LigneFacturation {
  const prixUnitaire = getPrixProcedure(typeProcedure);
  
  return {
    id: crypto.randomUUID(),
    type: 'procedure',
    description: typeProcedure,
    quantite,
    prix_unitaire_original: prixUnitaire,
    prix_unitaire: prixUnitaire,
    prix_total: prixUnitaire * quantite,
    tva_applicable: true,
    prix_modifie: false,
    paye_par_avocat: false,
  };
}

// Factory pour créer une ligne de prestation
export function creerLignePrestation(
  typePrestation: string,
  description: string,
  prix: number,
  quantite: number = 1
): LigneFacturation {
  return {
    id: crypto.randomUUID(),
    type: 'prestation',
    description,
    quantite,
    prix_unitaire_original: prix,
    prix_unitaire: prix,
    prix_total: prix * quantite,
    tva_applicable: true,
    prix_modifie: false,
    paye_par_avocat: false,
  };
}

// Factory pour créer une ligne de frais tiers
export function creerLigneFraisTiers(
  description: string,
  montant: number
): LigneFacturation {
  return {
    id: crypto.randomUUID(),
    type: 'frais_tiers',
    description,
    quantite: 1,
    prix_unitaire_original: montant,
    prix_unitaire: montant,
    prix_total: montant,
    tva_applicable: false,
    prix_modifie: false,
    paye_par_avocat: false,
  };
}

// Modifier le prix d'une ligne
export function modifierPrixLigne(
  ligne: LigneFacturation,
  nouveauPrix: number,
  raison?: string
): LigneFacturation {
  return {
    ...ligne,
    prix_unitaire: nouveauPrix,
    prix_total: nouveauPrix * ligne.quantite,
    prix_modifie: true,
    note_modification: raison,
  };
}

// Marquer une ligne comme payée par l'avocat
export function marquerPayeParAvocat(
  ligne: LigneFacturation,
  paye: boolean
): LigneFacturation {
  return {
    ...ligne,
    paye_par_avocat: paye,
  };
}

// Appliquer une remise globale
export function appliquerRemise(
  lignes: LigneFacturation[],
  remise: RemiseFacture
): LigneFacturation[] {
  const sousTotal = lignes.reduce((sum, l) => sum + l.prix_total, 0);
  
  let montantRemise = 0;
  if (remise.type === 'pourcentage') {
    montantRemise = sousTotal * (remise.valeur / 100);
  } else {
    montantRemise = remise.valeur;
  }

  // Répartir la remise proportionnellement
  return lignes.map(ligne => {
    const proportion = ligne.prix_total / sousTotal;
    const remiseLigne = montantRemise * proportion;
    const nouveauTotal = ligne.prix_total - remiseLigne;
    const nouveauPrixUnit = nouveauTotal / ligne.quantite;

    return {
      ...ligne,
      prix_unitaire: nouveauPrixUnit,
      prix_total: nouveauTotal,
      prix_modifie: true,
      note_modification: remise.raison || `Remise ${remise.type === 'pourcentage' ? remise.valeur + '%' : remise.valeur + '€'}`,
    };
  });
}

// Calculer les totaux
export interface CalculFacture {
  lignes: LigneFacturation[];
  sous_total_ht: number;
  montant_tva: number;
  total_ttc: number;
  montant_avance_avocat: number;
  montant_facture_client: number;
}

export function calculerFacture(
  lignes: LigneFacturation[],
  remise?: RemiseFacture
): CalculFacture {
  // Appliquer remise si présente
  const lignesFinales = remise ? appliquerRemise(lignes, remise) : lignes;

  const sousTotal = lignesFinales.reduce((sum, l) => sum + l.prix_total, 0);
  
  const montantAvecTva = lignesFinales
    .filter(l => l.tva_applicable)
    .reduce((sum, l) => sum + l.prix_total, 0);
  
  const montantTva = montantAvecTva * 0.20;
  const totalTTC = sousTotal + montantTva;

  const montantAvanceAvocat = lignesFinales
    .filter(l => l.paye_par_avocat)
    .reduce((sum, l) => sum + l.prix_total, 0);

  const montantFactureClient = totalTTC - montantAvanceAvocat;

  return {
    lignes: lignesFinales,
    sous_total_ht: sousTotal,
    montant_tva: montantTva,
    total_ttc: totalTTC,
    montant_avance_avocat: montantAvanceAvocat,
    montant_facture_client: montantFactureClient,
  };
}