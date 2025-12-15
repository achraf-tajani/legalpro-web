
export interface Utilisateur {
  id: string;
  user_id?: string;
  email: string;
  nom?: string;
  prenom?: string;
  type_utilisateur?: 'ADMIN' | 'AVOCAT' | 'CLIENT';
  avocat_id?: string;
  client_id?: string;
  est_actif: boolean;
  created_at: string;
  updated_at: string;
  avocat?: Avocat;
}

export interface Avocat {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  numero_barreau: string;
  specialite?: string;
  statut: 'actif' | 'inactif' | 'suspendu';
  tarif_horaire?: number;
  cabinet?: string;
  user_id?: string;
}

export interface CreateAvocatDto {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  numero_barreau: string;
  specialite?: string;
  tarif_horaire?: number;
  cabinet?: string;
  type_utilisateur: 'ADMIN' | 'AVOCAT' | 'CLIENT';
}

export interface UpdateUtilisateurDto {
  nom?: string;
  prenom?: string;
  type_utilisateur?: 'ADMIN' | 'AVOCAT' | 'CLIENT';
  est_actif?: boolean;
}

export interface UpdateAvocatDto {
  nom?: string;
  prenom?: string;
  telephone?: string;
  specialite?: string;
  statut?: 'actif' | 'inactif' | 'suspendu';
  tarif_horaire?: number;
  cabinet?: string;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface ResetPasswordDto {
  userId: string;
}