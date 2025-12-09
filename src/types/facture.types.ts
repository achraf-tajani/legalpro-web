// Interfaces pour les lignes
export interface LigneFacturationSnapshot {
  type: 'procedure' | 'prestation' | 'frais_tiers';
  description: string;
  quantite: number;
  prix_unitaire: number;
  prix_total: number;
  tva_applicable: boolean;
}

export interface RemiseFacture {
  type: 'pourcentage' | 'montant_fixe';
  valeur: number;
  raison?: string;
}

export interface FactureDetails {
  lignes: LigneFacturationSnapshot[];
  remise?: RemiseFacture;
  montant_avance_avocat?: number;
}

// Interface principale Facture
export interface Facture {
  id: string;
  id_dossier: string;
  id_client: string;
  numero: string;
  montant_ht: number;
  montant_ttc: number;
  taux_tva: number;
  reduction: number;
  date_emission: string;
  date_echeance?: string;
  statut: 'brouillon' | 'envoyee' | 'payee' | 'en_retard' | 'annulee';
  methode_facturation?: string;
  mode_paiement?: string;
  moyen_paiement?: string;
  date_paiement?: string;
  notes?: string;
  conditions?: string;
  montant_paye: number;
  details?: FactureDetails;
  created_at: string;
  updated_at: string;
}

// DTOs
export interface CreateFactureDto {
  id_dossier: string;
  id_client: string;
  numero: string;
  montant_ht: number;
  taux_tva?: number;
  reduction?: number;
  date_echeance?: string;
  statut?: 'brouillon' | 'envoyee';
  methode_facturation?: string;
  mode_paiement?: string;
  notes?: string;
  conditions?: string;
  details?: FactureDetails;
}

export interface UpdateFactureDto extends Partial<CreateFactureDto> {}

// Interface pour le pricing (frontend uniquement)
export interface LigneFacturation {
  id: string;
  type: 'procedure' | 'prestation' | 'frais_tiers';
  description: string;
  quantite: number;
  prix_unitaire_original: number;
  prix_unitaire: number;
  prix_total: number;
  tva_applicable: boolean;
  prix_modifie: boolean;
  paye_par_avocat: boolean;
  note_modification?: string;
}