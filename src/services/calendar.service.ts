import { apiClient } from './api.client';
import { API_ENDPOINTS } from '../config/api.config';
import type { CalendarEvent } from '../types/calendar.types';
import type { Procedure } from '../types/procedure.types';

class CalendarService {
  async getEvents(): Promise<CalendarEvent[]> {
    // Récupérer toutes les procédures
    const proceduresResponse = await apiClient.get<Procedure[]>(API_ENDPOINTS.PROCEDURES.LIST);
    
    const events: CalendarEvent[] = [];

    // Convertir les procédures en événements calendrier
    proceduresResponse.data.forEach((proc) => {
      if (proc.date_evenement) {
        events.push({
          id: proc.id,
          title: proc.titre,
          start: new Date(proc.date_evenement),
          end: new Date(proc.date_evenement),
          type: 'procedure',
          dossierId: proc.id_dossier,
          dossierTitre: proc.titre,
          priorite: proc.priorite,
          statut: proc.statut,
        });
      }

      // Ajouter aussi les deadlines comme événements séparés
      if (proc.deadline) {
        events.push({
          id: `${proc.id}-deadline`,
          title: `⏰ Deadline: ${proc.titre}`,
          start: new Date(proc.deadline),
          end: new Date(proc.deadline),
          type: 'procedure',
          dossierId: proc.id_dossier,
          dossierTitre: proc.titre,
          priorite: 'critical',
          statut: proc.statut,
        });
      }
    });

    // TODO: Ajouter les tâches plus tard
    
    return events;
  }
}

export const calendarService = new CalendarService();