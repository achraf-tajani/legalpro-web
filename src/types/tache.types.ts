export interface Tache {
  id: string;
  id_dossier: string;
  titre: string;
  description: string | null;
  priorite: 'low' | 'normal' | 'high' | 'critical';
  statut: 'not_started' | 'in_progress' | 'pending' | 'completed' | 'cancelled';
  date_creation: string;
  date_echeance: string | null;
  assigne_a: string | null;
  progression: number;
  tags: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTacheDto {
  id_dossier: string;
  titre: string;
  description?: string;
  priorite?: 'low' | 'normal' | 'high' | 'critical';
  statut?: 'not_started' | 'in_progress' | 'pending' | 'completed' | 'cancelled';
  date_echeance?: string;
  assigne_a?: string;
  progression?: number;
  tags?: string;
}

export interface UpdateTacheDto extends Partial<CreateTacheDto> {}