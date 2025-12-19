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
  type_adversaire?: string;
  email?: string;
  telephone?: string;
  avocat_adverse?: string;
  cabinet?: string;
  fonction?: string;
  adresse?: string;
  strategie_known?: string;
}

export interface UpdateAdversaireDto extends Partial<CreateAdversaireDto> {}