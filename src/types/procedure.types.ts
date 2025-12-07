export interface Procedure {
  id: string;
  id_dossier: string;
  titre: string;
  description?: string;
  type: string;
  etape?: string;
  deadline?: string;
  date_evenement?: string;
  statut: 'scheduled' | 'in_progress' | 'postponed' | 'completed' | 'cancelled';
  priorite: 'low' | 'normal' | 'high' | 'critical';
  tribunal?: string;
  juge_assigne?: string;
  salle?: string;
  notes?: string;
  frais_associes?: number;
  date_creation: string;
  date_modification: string;
}

export interface CreateProcedureDto {
  id_dossier: string | undefined;
  titre: string;
  description?: string;
  type: string;
  etape?: string;
  deadline?: string;
  date_evenement?: string;
  statut: 'scheduled' | 'in_progress' | 'postponed' | 'completed' | 'cancelled';
  priorite: 'low' | 'normal' | 'high' | 'critical';
  tribunal?: string;
  juge_assigne?: string;
  salle?: string;
  notes?: string;
  frais_associes?: number;
}

export interface UpdateProcedureDto extends Partial<CreateProcedureDto> {}