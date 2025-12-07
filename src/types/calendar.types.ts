export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'procedure' | 'tache';
  dossierId: string;
  dossierTitre: string;
  priorite?: 'low' | 'normal' | 'high' | 'critical';
  statut?: string;
}

export interface CalendarFilters {
  dossiers: string[];
  types: ('procedure' | 'tache')[];
  priorites: string[];
}