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
  id_client?: string;
}

// DTO pour mettre à jour un dossier (optionnel pour plus tard)
export interface UpdateDossierDto extends Partial<CreateDossierDto> {}