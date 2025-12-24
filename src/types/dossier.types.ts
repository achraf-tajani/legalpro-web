export interface Dossier {
  id: string;
  titre: string;
  description?: string;
  type: string;
  domaine?: string;
  statut: 'ouvert' | 'en_cours' | 'suspendu' | 'clos' | 'archive';
  priorite: 'basse' | 'normale' | 'haute' | 'critique';
  montant_en_jeu?: number;
  tribunal?: string;
  reference?: string;
  confidentialite?: string;
  avocat_assigne?: string;
  id_client?: string;
  date_creation: string;
  date_modification: string;
  client?: {
    id: string;
    nom: string;
    prenom?: string;
  };
}

export interface CreateDossierDto {
  titre: string | null;
  description?: string | null;
  type: string | null;
  domaine?: string | null;
  statut: 'ouvert' | 'en_cours' | 'suspendu' | 'clos' | 'archive';
  priorite: 'basse' | 'normale' | 'haute' | 'critique';
  montant_en_jeu?: number | null;
  tribunal?: string | null;
  reference?: string | null;
  confidentialite?: string | null;
  avocat_assigne?: string | null;
  id_client?: string | null;
}

// DTO pour mettre à jour un dossier (optionnel pour plus tard)
export interface UpdateDossierDto extends Partial<CreateDossierDto> {}