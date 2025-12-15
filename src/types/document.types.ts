export interface Document {
  id: string;
  id_dossier: string;
  nom: string;
  description?: string;
  type?: string;
  categorie?: string;
  format?: string;
  chemin_local?: string;
  url_cloud?: string;
  version: number;
  date_creation: string;
  date_modification: string;
  auteur?: string;
  statut: 'brouillon' | 'validé' | 'archivé' | 'supprimé';
  taille_mo?: number;
  niveau_confidentialite: 'public' | 'interne' | 'confidentiel' | 'secret';
  est_template: boolean;
  est_chiffre: boolean;
  created_at: string;
  updated_at: string;
}