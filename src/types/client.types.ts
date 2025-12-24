export interface Client {
  id: string;
  nom: string;
  prenom?: string;
  type_client: 'personne_physique' | 'entreprise' | 'organisation';
  email?: string;
  telephone?: string;
  adresse?: string;
  code_postal?: string;
  ville?: string;
  pays?: string;
  date_inscription: string;
  statut: 'actif' | 'inactif' | 'suspendu';
  type_entite?: string;
  montant_total_facture: number;
  created_at: string;
  updated_at: string;
}

export interface CreateClientDto {
  nom: string;
  prenom?: string;
  type_client: 'personne_physique' | 'entreprise' | 'organisation';
  email?: string  | null;
  telephone?: string  | null;
  adresse?: string  | null;
  code_postal?: string  | null;
  ville?: string  | null;
  pays?: string  | null;
  type_entite?: string  | null;
}

export interface UpdateClientDto extends Partial<CreateClientDto> {}