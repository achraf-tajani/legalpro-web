export interface Adversaire {
  id: string;
  id_dossier: string;
  nom: string;
  type_adversaire?: string;
  email?: string;
  telephone?: string;
  avocat_adverse?: string;
  cabinet?: string;
  fonction?: string;
  adresse?: string;
  strategie_known?: string;
  date_ajout: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAdversaireDto {
  id_dossier: string;
  nom: string;
  type_adversaire?: string |  null;
  email?: string | null;
  telephone?: string | null;
  avocat_adverse?: string | null;
  cabinet?: string | null;
  fonction?: string | null;
  adresse?: string | null;
  strategie_known?: string | null;
}

export interface UpdateAdversaireDto extends Partial<CreateAdversaireDto> {}